import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getSupportByExtent, getRelatedSigns} from '../../utils/JSAPI';

// WORKER //

function * setSelectSupport(action) {

    try {

        // call API to fetch config
        const features = yield call(getSupportByExtent, [action.payload.geom, action.payload.layer]);
        console.log('feature', features.features.length)
        if (features.features.length === 0) {
            const support = { selSupport:null};
            const signs = {signs:[]};
            yield put({
                type: mapTypes.SET_SELECTED_SUPPORT,
                payload: {
                    support,
                    signs
                }
            });
        } else {
            const support = {
                selSupport: features.features[0]
            };
            const signsREsp = yield call(getRelatedSigns, [
                support, 'https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServ' +
                        'er/1/query'
            ])
            const signs = {
                signs: signsREsp.data.features
            };

            // Put config in store
            yield put({
                type: mapTypes.SET_SELECTED_SUPPORT,
                payload: {
                    support,
                    signs
                }
            });
        }
    } catch (e) {
        console.log('SAGA ERROR: map/setSelectedSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {
    yield takeLatest(mapTypes.MAP_CLICKED, setSelectSupport);
}
