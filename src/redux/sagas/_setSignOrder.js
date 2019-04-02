import {call,  takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import { saveSignOrder} from '../../utils/JSAPI';

// WORKER //

function * setSignOrder(action) {

    try {
        
        // call API to save signs with new SIGNORDER

        yield call(saveSignOrder, [action.payload.features, action.payload.layers.signs]);
        yield getFullSignPost(action);

    } catch (e) {
        console.log('SAGA ERROR: map/setSignOrder, ', e);
    }
}

// WATCHER //
export function * watchSignOrder() {

    yield takeLatest(mapTypes.SIGN_ORDER_CHANGED, setSignOrder);
}