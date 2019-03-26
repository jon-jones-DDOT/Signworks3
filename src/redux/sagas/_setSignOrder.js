import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import { getRelatedSigns, saveSignOrder, getMUTCDS, getRelatedTimebands} from '../../utils/JSAPI';

// WORKER //

function * setSignOrder(action) {

    try {

        // call API to fetch config

         yield call(saveSignOrder, [action.payload.features]);
        const support =  action.payload.support;
      
        const signsREsp = yield call(getRelatedSigns, [
            support, 'https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServ' +
                    'er/1/query'
        ])
        const signArray = signsREsp.data.features;

        // start creating sign payload
        const signs = [];
         // create a string to get back MUTCD metadata for all signs on post

         let muttQueryString = "";
           
         if(signArray.length < 1){
             muttQueryString = "PR-OTHER"
         }
        for (let i = 0; i < signArray.length; i++) {
            if(signsREsp.data.features[i].attributes.SIGNCODE){
            muttQueryString += signsREsp.data.features[i].attributes.SIGNCODE + ",";}
            else{
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
                const results = yield call(getRelatedTimebands, [signArray[i]])
                sign.timebands = results.data.features;
                //WILL POPULATE WHEN SIGNWORKS CATALOG WORKS
                sign.MUTCD = muttData[i];
                signs.push(sign)
              
            }



console.log("* updated features", signs)
        // Put config in store
        yield put({
            type: mapTypes.SET_SELECTED_SUPPORT,
            payload: {
                support,
                signs
            }
        });

    } catch (e) {
        console.log('SAGA ERROR: map/setSignOrder, ', e);
    }
}

// WATCHER //
export function * watchSignOrder() {

    yield takeLatest(mapTypes.SIGN_ORDER_CHANGED, setSignOrder);
}