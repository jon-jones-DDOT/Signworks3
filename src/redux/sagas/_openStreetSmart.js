import {call, put, takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {projectGeometry, getSupportByExtent, pointToExtentSaga, createFeatureSet} from '../../utils/JSAPI'
import {faWindows} from '@fortawesome/free-brands-svg-icons';

// WORKER //

function * openStreetSmart(action) {
    try {
        // this ball of wax has a ridiculous number of async calls, I am gonna try to do
        // them all here in the saga

        const projectResult = yield call(projectGeometry, [
            [action.payload.sel[0].geometry],
            action.payload.layers.geometryService,
            action.payload.inSR,
            action.payload.outSR
        ]);

        // now we have the projected (2248) support, let's make a geoJSON feature set
        // out of it yay
    
        let sel2 = {
            ...action.payload.sel[0]
        }
        sel2.geometry = projectResult[0];
 
        const selPtFeatureSet = yield call(createFeatureSet, [sel2])
        const gjPt = window
            .ArcgisToGeojsonUtils
            .arcgisToGeoJSON(selPtFeatureSet)
 

        // now we have the geoJSON for the selected point overlay, let's get the nearby
        // points overlay first get the extent
        const localExtent = yield call(pointToExtentSaga, [
            action.payload.viewWidth, action.payload.viewExtentWidth, action.payload.view_spatRef, action.payload.sel[0].geometry, 400 //tolerance in pixels

        ])

        //get neighboring points from the selected support
        const features = yield call(getSupportByExtent, [localExtent, action.payload.layers.supports, 2248]);
        const neighborFeatures = features.data.features;
        //make them a featureset because the converter is picky like that

for(let i = 0; i < neighborFeatures.length;i++){
    neighborFeatures[i].geometry.type = "point";
    neighborFeatures[i].geometry.spatialReference = {wkid:2248}
}
        const neighborFeatureSet = yield call(createFeatureSet, [neighborFeatures])

        //convert FeatureSet to geoJSON feature set
        const gjNeighbors = window
            .ArcgisToGeojsonUtils
            .arcgisToGeoJSON(neighborFeatureSet)

        yield put({
            type: graphicTypes.SHOW_STREETSMART_VIEWER_RG,
            payload: {
                leftVisible: true,
                editMode:action.payload.editMode,
                ssInputGeom: projectResult,
                ssgeoJSONselPoint: gjPt,
                ssOverlay: gjNeighbors
            }
        });

    } catch (e) {
        console.log('SAGA ERROR: graphic/openStreetSmart, ', e);
    }
}

// WATCHER //
export function * watchStreetSmart() {

    yield takeLatest(graphicTypes.START_STREETSMART_VIEWER_S, openStreetSmart);
}
