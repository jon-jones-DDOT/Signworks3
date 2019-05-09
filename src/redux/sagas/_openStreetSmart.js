import {call, put,takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {projectGeometry} from '../../utils/JSAPI'



// WORKER //

function * openStreetSmart(action) {
    try{
     
       const projectResult =   yield call(projectGeometry, [action.payload.coords,action.payload.layer, action.payload.inSR, action.payload.outSR]);
       
       const geoms = projectResult;
      
       //at some point we add code here to retrieve and reproject points for the overlay


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
