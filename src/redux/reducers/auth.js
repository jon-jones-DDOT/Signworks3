// Copyright 2019 Esri Licensed under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
// or agreed to in writing, software distributed under the License is
// distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the specific language
// governing permissions and limitations under the License.​ ACTION TYPES //
export const types = {
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    AUTH_FAIL: 'AUTH_FAIL',
    AUTH_CHECK: 'AUTH_CHECK',
    LOGOUT: 'LOGOUT'
}

// REDUCERS //
export const initialState = {
    user: null,
    loaded: false,
    loggedIn: false,
    isEditor:false,
    isViewer:false
}

export default(state = initialState, action) => {
    switch (action.type) {
        case types.AUTH_SUCCESS:
            const user = action.payload.user;

            return {
                ...state,
                user,
                loaded: true,
                loggedIn: true,
                isEditor: action.payload.isEditor,
                isViewer:action.payload.isViewer,
                isDev:action.payload.isDev
            };

        case types.AUTH_FAIL:
            return {
                ...state,
                user: null,
                loaded: true,
                loggedIn: false
            };

        default:
            return state;
    }
}

// ACTIONS //
export const actions = {
    checkAuth: (config) => ({
        type: types.AUTH_CHECK,
        payload: {
            config
        }
    }),

    logout: (url) => ({
        type: types.LOGOUT,
        payload: {
            portalUrl: url
        }
    })
}
