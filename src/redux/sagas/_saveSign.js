import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import {saveSign, saveTimebands} from '../../utils/JSAPI';

// WORKER //

function * saveSelectSign(action) {
    try{
     
         yield call(saveSign, [action.payload.sign, false,action.payload.layers]);

        yield call(saveTimebands,[action.payload.sign,action.payload.layers])
      
       
        
         yield getFullSignPost(action);
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveSelectedSign, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
   
    yield takeLatest(mapTypes.SAVE_SIGN_S, saveSelectSign);
}
