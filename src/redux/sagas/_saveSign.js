import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import {saveSign, saveTimebands} from '../../utils/JSAPI';

// WORKER //

function * saveSelectSign(action) {
    try{
     
       const signResult =   yield call(saveSign, [action.payload.sign, false,action.payload.layers]);

        const bandResult =  yield call(saveTimebands,[action.payload.sign,action.payload.layers])
        console.log('signs result', signResult,'band result', bandResult);
       
        
         yield getFullSignPost(action);
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveSelectedSign, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
   
    yield takeLatest(mapTypes.SAVE_SIGN, saveSelectSign);
}
