import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import { getRelatedSigns, saveSignOrder} from '../../utils/JSAPI';

// WORKER //

function * setSignOrder(action) {

    try {

        // call API to fetch config

        const resp = yield call(saveSignOrder, [action.payload.features]);

        const support =  action.payload.support;
      
        const signsREsp = yield call(getRelatedSigns, [
            support, 'https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServ' +
                    'er/1/query'
        ])

        const signs = {
            features: signsREsp.data.features
        };

        // Put config in store
        yield put({type: mapTypes.SET_SIGN_ORDER, payload: {

                signs
            }});

    } catch (e) {
        console.log('SAGA ERROR: map/setSignOrder, ', e);
    }
}

// WATCHER //
export function * watchSignOrder() {

    yield takeLatest(mapTypes.SIGN_ORDER_CHANGED, setSignOrder);
}