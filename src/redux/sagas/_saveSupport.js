import {call,put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {types as graphicTypes} from '../reducers/graphic';
import {getFullSignPost} from './reload'
import {saveSupport} from '../../utils/JSAPI';

// WORKER //

function * saveSelectSupport(action) {
    try{
      action.payload.support.geometry.spatialReference ={ wkid: 4326};
         yield call(saveSupport, [action.payload.support, false, action.payload.layers.supports]);
         yield put({
            type: graphicTypes.NEED_SUPPORT_REFRESH_RG,
            payload: {
                needSupRefresh: true
            }
        })

         yield getFullSignPost(action);
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveSelectedSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
   
    yield takeLatest(mapTypes.SAVE_SUPPORT_S, saveSelectSupport);
}
