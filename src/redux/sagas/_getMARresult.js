import {call, put,takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {getLocation2} from '../../utils/JSAPI'



// WORKER //

function * query(action) {
    try{
     
     //  const queryResult =   yield call(superQuery, [action.payload.where, action.payload.extent,action.payload.layer]);
       
    //   const features = queryResult.data.features;

    const queryResult = yield call(getLocation2,"white");
    console.log('queryResult', queryResult)
       
       yield put({
        type: graphicTypes.SET_MAR_RESULTS_RG,
        payload: {
            queryFeatures:features,
            queryCount: features.length
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
