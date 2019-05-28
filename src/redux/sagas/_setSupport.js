import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getSupportByExtent} from '../../utils/JSAPI';
import {getFullSignPost} from './reload'

// WORKER //

function * setSelectSupport(action) {

    try {

        // call API to fetch support
        const features = yield call(getSupportByExtent, [action.payload.geom, action.payload.layers.supports,4326]);

      
        if (features.data.features.length === 0) {
           
            return;
        
            //if a support is returned...
        } else {
            //create support payload from support returned
            action.payload.support = features.data.features[0];
            yield getFullSignPost(action)

        }
    } catch (e) {
        console.log('SAGA ERROR: map/setSelectedSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
    yield takeLatest(mapTypes.SELECT_SUPPORT_S, setSelectSupport);
}
