import {call, put, takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {projectGeometry, getSupportByExtent, pointToExtentSaga, createTriangle} from '../../utils/JSAPI'

// WORKER //

function * getCone(action) {
    try {

       
        const x = action.payload.point[0];
        const y = action.payload.point[1];
        const z = action.payload.point[2];
        const newPoint = {
            type: 'point',
            x: x,
            y: y,
            z: z,
            SpatialReference: {
                wkid: 2248
            }
        }


        
        const results = yield call( projectGeometry,[[newPoint], action.payload.layers.geometryService, 2248, 4326]);
        const triangle = yield call(createTriangle,[results, action.payload.pitch, action.payload.yaw])
       console.log('results, triangle :', results, triangle);
     
    
       


        yield put({
            type: graphicTypes.SET_NEW_CONE_RG,
            payload: {
                coneGraphic:triangle[0],
                conePointGraphic:triangle[1]
            }
        });

    } catch (e) {
        console.log('SAGA ERROR: graphic/getNewCone, ', e);
    }
}

// WATCHER //
export function * watchStreetSmart() {

    yield takeLatest(graphicTypes.GET_NEW_CONE_S, getCone);
}
