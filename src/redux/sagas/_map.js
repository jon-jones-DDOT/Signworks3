


import { call, put, takeLatest } from 'redux-saga/effects';
import { types as mapTypes } from '../reducers/map';
import {getSupportById, getSupportByExtent} from '../../utils/JSAPI';


//WORKER

// WORKER //
function* setSelectSupport (action) {
   
    try {
       console.log(action)
        // call API to fetch config
        const feature = yield call(getSupportByExtent,[action.payload.geom,action.payload.layer]);

        // Put config in store
        yield put({
            type: mapTypes.SET_SELECTED_SUPPORT,
            payload: feature
        });

    } catch (e) {
        console.log('SAGA ERROR: map/setSelectedSupport, ', e);
    }
}


// WATCHER //
export function* watchLayers() {
    yield takeLatest(mapTypes.MAP_CLICKED, setSelectSupport);
}


