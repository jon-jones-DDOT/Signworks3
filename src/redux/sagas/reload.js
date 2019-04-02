import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import { getRelatedSigns, getMUTCDS, getRelatedTimebands} from '../../utils/JSAPI';

export function * getFullSignPost(action) {

    try {
        const errorMUTCD = {
            name: "MUTCD not found",
            serverImagePath: "none"
        }
        
        const support = action.payload.support;
        // retrieve the new related signs with a call to AGS
        const signsREsp = yield call(getRelatedSigns, [support, action.payload.layers.signs])

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

        //loop through globalIDS and get timebands
        for (let i = 0; i < signArray.length; i++) {
            let sign = {
                feature: signArray[i]

            }
            const results = yield call(getRelatedTimebands, [signArray[i], action.payload.layers.timebands])

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
        
    } catch (e) {
        console.log('SAGA ERROR: map/reload, ', e);
    }

}