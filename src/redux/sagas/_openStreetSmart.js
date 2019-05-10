import {call, put,takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {projectGeometry,getSupportByExtent,pointToExtentSaga} from '../../utils/JSAPI'



// WORKER //

function * openStreetSmart(action) {
    try{
     
 
       const projectResult =   yield call(projectGeometry, [action.payload.coords,
        action.payload.layers.geometryService, action.payload.inSR, action.payload.outSR]);
       
       const geoms = projectResult;
      

const localExtent = yield call(pointToExtentSaga,[ action.payload.viewWidth,
action.payload.viewExtentWidth,
action.payload.view_spatRef,
action.payload.coords[0],
400  //tolerance in pixels


])


       //get neighboring points from the selected support
     const features = yield call(getSupportByExtent, [localExtent, action.payload.layers.supports,2248]);






       yield put({
        type: graphicTypes.SHOW_STREETSMART_VIEWER,
        payload: {
            leftVisible: true,
            ssEdit: false,
            ssView: true,
            ssInputGeom:geoms
        }
    });

        
    }
    
    catch (e) {
        console.log('SAGA ERROR: graphic/openStreetSmart, ', e);
    }
}

// WATCHER //
export function * watchStreetSmart() {
   
    yield takeLatest(graphicTypes.START_STREETSMART_VIEWER, openStreetSmart);
}
