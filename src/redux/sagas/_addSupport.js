import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import {saveSupport} from '../../utils/JSAPI';

// WORKER //

function * addSelectSupport(action) {
    try{
      
         yield call(saveSupport, [action.payload.support, true, action.payload.layers.supports]);
        
         yield getFullSignPost(action);
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveSelectedSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
   
    yield takeLatest(mapTypes.NEW_SUPPORT_S, addSelectSupport);
}
