import {call, put, takeLatest} from 'redux-saga/effects';
import {types as graphicTypes} from '../reducers/graphic';
import {projectGeometry, getSupportByExtent, pointToExtentSaga, createFeatureSet} from '../../utils/JSAPI'


// WORKER //

function * openGoogleStreetView(action) {
    try {
        


        yield put({
            type: graphicTypes.SHOW_GOOGLE_STREET_VIEWER_RG,
            payload: {
                leftVisible: true,
                leftMode:'Google'
            }
        });

    } catch (e) {
        console.log('SAGA ERROR: graphic/openGoogleStreet, ', e);
    }
}

// WATCHER //
export function * watchGoogleStreet() {

    yield takeLatest(graphicTypes.START_GOOGLE_STREET_VIEWER_S, openGoogleStreetView);
}
