// Copyright 2019 Esri Licensed under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
// or agreed to in writing, software distributed under the License is
// distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the specific language
// governing permissions and limitations under the License.​ ACTION TYPES //
export const types = {
    MAP_LOADED: "MAP_LOADED",
    SET_FEATURES: "SET_FEATURES",
    MAP_CLICKED: "MAP_CLICKED",
    SET_SELECTED_SUPPORT: "SET_SELECTED_SUPPORT",
    DOMAINS_LOADED: "DOMAINS_LOADED"
};

// REDUCERS //
export const initialState = {
    loaded: false,
    features: [],
    selSupport: null
};

export default(state = initialState, action) => {

    switch (action.type) {
        case types.MAP_LOADED:
            return {
                ...state,
                loaded: true
            };

        case types.SET_SELECTED_SUPPORT:

            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
};

// ACTIONS //
export const actions = {
    mapLoaded: () => ({type: types.MAP_LOADED, payload: {}}),
    mapClicked: (geom, layer) => ({
        type: types.MAP_CLICKED,
        payload: {
            geom: geom,
            layer: layer
        }

    }),
    domainsLoaded: () => ({type: types.MAP_LOADED, payload: {}})
}
