import {call, put,takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {superQuery} from '../../utils/JSAPI'



// WORKER //

function * query(action) {
    try{
     
       const queryResult =   yield call(superQuery, [action.payload.where, action.payload.extent,action.payload.layer]);
       
       const features = queryResult.data.features;
       yield put({
        type: graphicTypes.SET_QUERY_RESULTS_RG,
        payload: {
            queryFeatures:features
        }
    });
        
    }
    
    catch (e) {
        console.log('SAGA ERROR: map/saveSelectedSign, ', e);
    }
}

// WATCHER //
export function * watchQuery() {
   
    yield takeLatest(graphicTypes.QUERY_SUPERQUERY_S, query);
}
