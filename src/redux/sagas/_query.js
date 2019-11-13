import {call, put, takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';

import {superQuery, superExtent} from '../../utils/JSAPI'

// WORKER //

function * query(action) {
    try {

        const queryResult = yield call(superQuery, [action.payload.where, action.payload.extent, action.payload.layer]);

        let extent = yield call(superExtent, [action.payload.where, action.payload.extent, action.payload.layer]);
        extent = extent.extent;
// what mischief is this?  The query result for the extent is one zoom click smaller than it needs to be.  Thanks , ESRI.
// so here I bump the size of the extent up a bit to kick it up to the next LOD.
        let xmax = extent.xmax;
        let xmin = extent.xmin;
        let ymax = extent.ymax;
        let ymin = extent.ymin;

        let w1 = xmax - xmin;
        let h1 = ymax - ymin;
        let w2 = w1 * .1;
        let h2 = h1 * .1;

        extent.xmax = extent.xmax + w2;
        extent.xmin = extent.xmin - w2;
        extent.ymax = extent.ymax + h2;
        extent.ymin = extent.ymin - h2;

        const features = queryResult.features;

        yield put({
            type: graphicTypes.SET_QUERY_RESULTS_RG,
            payload: {
                queryFeatures: features,
                queryCount: features.length,
                queryResultsExt: extent
            }
        });

        /* yield put({
        type:graphicTypes. SET_QUERY_RESULTS_EXTENT_RG,
        payload:{ queryResultsExt: extent}

        }); */

    } catch (e) {
        console.log('SAGA ERROR: graphic/query, ', e);
    }
}

// WATCHER //
export function * watchQuery() {

    yield takeLatest(graphicTypes.QUERY_SUPERQUERY_S, query);
}
