import {call, put, takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import { getPointOnRouteLRS, projectGeometry, getSupportByExtent, pointToExtentSaga, createFeatureSet} from '../../utils/JSAPI'


// WORKER //

function * openGoogleStreetView(action) {
    try {
     
       const lrsResults = yield call(getPointOnRouteLRS, [action.payload.sel, action.payload.layers.LRS_Service, 4326,4326]);
      
        const lrsInfo = lrsResults.data.pointOnRoutes[0];

        yield put({
            type: graphicTypes.SHOW_GOOGLE_STREET_VIEWER_RG,
            payload: {
                leftVisible: true,
                leftMode:'Google'
            }
        });

    } catch (e) {
        console.log('SAGA ERROR: graphic/openGoogleStreet, ', e);
    }
}

// WATCHER //
export function * watchGoogleStreet() {

    yield takeLatest(graphicTypes.START_GOOGLE_STREET_VIEWER_S, openGoogleStreetView);
}
