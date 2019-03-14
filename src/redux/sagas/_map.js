import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getSupportByExtent} from '../../utils/JSAPI';

// WORKER //

function * setSelectSupport(action) {

    try {
       
        // call API to fetch config
        const features = yield call(getSupportByExtent, [action.payload.geom, action.payload.layer]);
        const feature = {selSupport:features.features[0]} ;
        console.log ('feature returned from JSAPI', feature)
        // Put config in store
        yield put({type: mapTypes.SET_SELECTED_SUPPORT, payload:feature});

    } catch (e) {
        console.log('SAGA ERROR: map/setSelectedSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
    yield takeLatest(mapTypes.MAP_CLICKED, setSelectSupport);
}
