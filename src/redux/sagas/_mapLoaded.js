import {call,put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getAllMUTCDS} from '../../utils/JSAPI'


// WORKER //

function * setInitConfig(action) {

    try {
        
        // call API to save signs with new SIGNORDER

        const muttData = yield call(getAllMUTCDS,[])
     
     // Put marker in store
     yield put({
        type: mapTypes.INIT,
        payload: {
            muttArray:muttData,
            extent:action.payload.extent
        }
    });

    } catch (e) {
        console.log('SAGA ERROR: map/mapLoaded, ', e);
    }
}

// WATCHER //
export function * watchSignOrder() {

    yield takeLatest(mapTypes.MAP_LOADED, setInitConfig);
}