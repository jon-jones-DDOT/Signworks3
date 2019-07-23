import {call, put,takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {getLocation2} from '../../utils/JSAPI'



// WORKER //

function * query(action) {
    try{
     
     

    const queryResult = yield call(getLocation2,[action.payload.where, "address"]);
    const features = queryResult.returnDataset.Table1;
    console.log('queryResult', features)
       
       yield put({
        type: graphicTypes.SET_MAR_RESULTS_RG,
        payload: {
            marFeatures:features,
            marCount: features.length
        }
    });
        
    }
    
    catch (e) {
        console.log('SAGA ERROR: graphic/query, ', e);
    }
}

// WATCHER //
export function * watchMAR() {
   
    yield takeLatest(graphicTypes.QUERY_MAR_S, query);
}
