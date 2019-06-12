// Copyright 2019 Esri Licensed under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
// or agreed to in writing, software distributed under the License is
// distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the specific language
// governing permissions and limitations under the License.​

import {call, put, takeLatest} from 'redux-saga/effects';
import {types} from '../reducers/auth';
import {logout} from '../../services/api';
import {getGroups} from "../../utils/JSAPI"

// WORKER //
function * checkAuth(action) {
    try {
        let isEditor = false;
        let isViewer = false;
        let isDev = false;
        const authObj = yield call(window.authManager.login, action.payload.config.portalUrl);
        const edit = yield call(getGroups, [authObj.portal, "Signworks Editors"]);
        if (edit.results.length > 0) {
            isEditor = true;
            isViewer = true;

        } else {
            console.log('not reached, correct?')
            const view = yield call(getGroups, [authObj.portal, "Signworks Viewers"]);
            isEditor = false;
            isViewer = true;
        }

        if ( action.payload.config.release === "dev"){
            isDev = true;
        }
        // Check if the authObj is undefined
        if (authObj) {
            yield put({type: types.AUTH_SUCCESS, payload:{user:authObj, isEditor, isViewer, isDev} });
        } else {
            // putting a fail call here just means that we didn't need to login
            yield put({type: types.AUTH_FAIL});
        }

    } catch (e) {
        yield put({type: types.AUTH_FAIL});
        console.error('SAGA ERROR: auth/checkAuth, ', e);
    }
}

function * authLogout(action) {
    try {

        yield call(window.authManager.logout);
        yield call(logout, action.payload.portalUrl);
        window
            .location
            .reload();
    } catch (e) {
        console.error('SAGA ERROR: auth/logout, ', e);
    }
}

// WATCHER //
export function * watchStartAPI() {
    yield takeLatest(types.AUTH_CHECK, checkAuth);
    yield takeLatest(types.LOGOUT, authLogout);
}
