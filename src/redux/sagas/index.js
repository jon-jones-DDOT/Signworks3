// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

/**
 * Combine your Sagas into one output
 */

import { all, fork } from 'redux-saga/effects';

import * as authSagas from './_auth';
import * as configSagas from './_config';
import * as setSupportSaga from './_setSupport';
import * as signOrderSaga from './_setSignOrder';
import * as saveSupportSaga from './_saveSupport';
import * as saveSignSaga from './_saveSign';
import * as mapLoadedSaga from './_mapLoaded';
import * as newSignSaga from './_newSign';
import * as querySaga from './_query';
import * as streetSmartSaga from './_openStreetSmart';
import * as googleStreetSaga from './_openGoogleStreetView';
import * as newSupportSaga from './_newSupport';
import * as getConeSaga from './_getNewCone';
import * as getMARSaga from './_getMARresult';



export default function* rootSaga() {
  yield all([
    ...Object.values(authSagas),
    ...Object.values(configSagas),
    ...Object.values(setSupportSaga),
    ...Object.values(signOrderSaga),
    ...Object.values(saveSupportSaga),
    ...Object.values(mapLoadedSaga),
    ...Object.values(saveSignSaga),
    ...Object.values(newSignSaga),
    ...Object.values(querySaga),
    ...Object.values(streetSmartSaga),
    ...Object.values(newSupportSaga),
    ...Object.values(getConeSaga),
    ...Object.values(googleStreetSaga),
    ...Object.values(getMARSaga)

    // more sagas from different files
  ].map(fork));
}
