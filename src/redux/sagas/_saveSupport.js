import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import {saveSupport, getRelatedSigns, getMUTCDS, getRelatedTimebands} from '../../utils/JSAPI';

// WORKER //

function * saveSelectSupport(action) {
    try{
         let bob = yield call(saveSupport, [action.payload.support, false, action.payload.layers.supports]);
        
         yield getFullSignPost(action);
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveSelectedSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
   
    yield takeLatest(mapTypes.SAVE_SUPPORT, saveSelectSupport);
}
