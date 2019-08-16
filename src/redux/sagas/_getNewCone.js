import {call, put, takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {projectGeometry, createTriangle} from '../../utils/JSAPI'

// WORKER //

function * getCone(action) {
    try {
        let newPoint;
        let projPoint;

        if (action.payload.source === "StreetSmart") {
            const x = action.payload.point[0];
            const y = action.payload.point[1];
            const z = action.payload.point[2];
            newPoint = {
                type: 'point',
                x: x,
                y: y,
                z: z,
                SpatialReference: {
                    wkid: 2248
                }
            }
            projPoint = yield call(projectGeometry, [[newPoint], action.payload.layers.geometryService, 2248, 4326]);
       
        }
        else if(action.payload.source === "Google"){
           
            projPoint =[ action.payload.point];
      
        }

   
        const triangle = yield call(createTriangle, [projPoint, action.payload.pitch, action.payload.yaw, action.payload.source])

        yield put({
            type: graphicTypes.SET_NEW_CONE_RG,
            payload: {
                coneGraphic: triangle[0],
                conePointGraphic: triangle[1]
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
