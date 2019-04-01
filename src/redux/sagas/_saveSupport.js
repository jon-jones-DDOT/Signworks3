import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getSupportByExtent, getRelatedSigns, getMUTCDS, getRelatedTimebands} from '../../utils/JSAPI';

// WORKER //

function * saveSelectSupport(action) {

    try {
        const errorMUTCD = {
            name: "MUTCD not found",
            serverImagePath: "none"
        }
        // call API to fetch support
        const features = yield call(getSupportByExtent, [action.payload.geom, action.payload.layer]);

        //if nothing comes back, set sign info in store to empty or null
        if (features.features.length === 0) {
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
            const support = features.features[0];

            //retrieve associated sign features from AGS
            const signsREsp = yield call(getRelatedSigns, [
                support, 'https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServ' +
                        'er/1/query'
            ])
            const signArray = signsREsp.data.features;

            // start creating sign payload
            const signs = [];

            // create a string to get back MUTCD metadata for all signs on post

            let muttQueryString = "";

            if (signArray.length < 1) {
                muttQueryString = "PR-OTHER"
            }
            for (let i = 0; i < signArray.length; i++) {
                if (signArray[i].attributes.SIGNCODE) {
                    muttQueryString += signArray[i].attributes.SIGNCODE + ",";
                } else {
                    muttQueryString += "PR-OTHER,"
                }
            }
            muttQueryString = muttQueryString.replace(/,\s*$/, "");

            // call out to Sign Catalog API to get MUTCD metadata
            const muttData = yield call(getMUTCDS, [muttQueryString])

            for (let i = 0; i < signArray.length; i++) {}

            //loop through globalIDS and get timebands
            for (let i = 0; i < signArray.length; i++) {
                let sign = {
                    feature: signArray[i]

                }
                const results = yield call(getRelatedTimebands, [signArray[i]])
                sign.timebands = results.data.features;
                for (let j = 0; j < muttData.length; j++) {

                    if (signArray[i].attributes.SIGNCODE.toUpperCase() === muttData[j].code.toUpperCase()) {
                        sign.MUTCD = muttData[j];

                    }
                }
                if (sign.MUTCD === undefined) {
                    sign.MUTCD = errorMUTCD;

                }
                //WILL POPULATE WHEN SIGNWORKS CATALOG WORKS sign.MUTCD = muttData[i];
                signs.push(sign)

            }

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
    yield takeLatest(mapTypes.SAVE_SUPPORT, saveSelectSupport);
}
