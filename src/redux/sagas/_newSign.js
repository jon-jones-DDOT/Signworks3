import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import { saveSign } from '../../utils/JSAPI';



// WORKER //

function * saveNewSign(action) {
    try{
     
         yield call(saveSign, [action.payload.sign, true, action.payload.layers]);
      
        
         yield getFullSignPost(action);
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveNewSign, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
   
    yield takeLatest(mapTypes.NEW_SIGN_S, saveNewSign);
}
