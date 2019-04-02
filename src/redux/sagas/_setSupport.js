import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getSupportByExtent, getRelatedSigns, getMUTCDS, getRelatedTimebands} from '../../utils/JSAPI';
import {getFullSignPost} from './reload'

// WORKER //

function * setSelectSupport(action) {
   
    try {
        const errorMUTCD = {
            name: "MUTCD not found",
            serverImagePath: "none"
        }
        // call API to fetch support
        const features = yield call(getSupportByExtent, [action.payload.geom, action.payload.layers.supports]);
      
        //if nothing comes back, set sign info in store to empty or null
        if (features.data.features.length === 0) {
            const support = null;
            const signs = [];

            yield put({
                type: mapTypes.SET_SELECTED_SUPPORT,
                payload: {
                    support,
                    signs
                }
            });
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
    yield takeLatest(mapTypes.MAP_CLICKED, setSelectSupport);
}
