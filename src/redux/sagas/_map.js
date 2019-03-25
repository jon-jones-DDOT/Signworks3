import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getSupportByExtent, getRelatedSigns, saveSignOrder, getMUTCDS, getRelatedTimebands} from '../../utils/JSAPI';

// WORKER //

function * setSelectSupport(action) {

    try {

        // call API to fetch support
        const features = yield call(getSupportByExtent, [action.payload.geom, action.payload.layer]);

        //if nothing comes back, set sign info in store to empty or null
        if (features.features.length === 0) {
            const support = {
                selSupport: null
            };
            const signs = {
                signs: []
            };
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
            const support = {
                selSupport: features.features[0]
            };
            //retrieve associated sign features from AGS
            const signsREsp = yield call(getRelatedSigns, [
                support, 'https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServ' +
                        'er/1/query'
            ])
            const signArray = signsREsp.data.features;
            
            // start creating sign payload
            const signs = {
                signs: []
            };

            // create a string to get back MUTCD metadata for all signs on post
            
            let muttQueryString = "";
           
            for (let i = 0; i < signArray.length; i++) {
                    muttQueryString += signsREsp.data.features[i].attributes.SIGNCODE + ",";                  
            }
            muttQueryString = muttQueryString.replace(/,\s*$/, "");


            // call out to Sign Catalog API to get MUTCD metadata
          //  const muttData = yield call(getMUTCDS,[muttQueryString])
          //  console.log('mutts', muttData)

          //loop through globalIDS and get timebands
          for (let i =0;i <signArray.length; i++){
              let sign = {feature:signArray[i]}
              const results = yield call(getRelatedTimebands,[signArray[i]])
              sign.timebands = results.data.features;
              //WILL POPULATE WHEN SIGNWORKS CATALOG WORKS
              sign.MUTCD = {};
              signs.signs.push(sign)
              console.log("timebandit", signs)
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
    yield takeLatest(mapTypes.MAP_CLICKED, setSelectSupport);
}

// WORKER //

function * setSignOrder(action) {

    try {

        // call API to fetch config

        const resp = yield call(saveSignOrder, [action.payload.features]);
       
        const support = {
            selSupport: action.payload.support
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

    } catch (e) {
        console.log('SAGA ERROR: map/setSignOrder, ', e);
    }
}

// WATCHER //
export function * watchSignOrder() {

    yield takeLatest(mapTypes.SIGN_ORDER_CHANGED, setSignOrder);
}
