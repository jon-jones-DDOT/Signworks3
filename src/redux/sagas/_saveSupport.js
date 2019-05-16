import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import {saveSupport} from '../../utils/JSAPI';

// WORKER //

function * saveSelectSupport(action) {
    try{
      
         yield call(saveSupport, [action.payload.support, false, action.payload.layers.supports]);
        console.log('action in save Supportr', action)
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
