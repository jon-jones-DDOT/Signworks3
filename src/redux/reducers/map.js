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
    MAP_CLICKED: "MAP_CLICKED",
    SET_SELECTED_SUPPORT: "SET_SELECTED_SUPPORT",
    SIGN_ORDER_CHANGED: "SIGN_ORDER_CHANGED",
    MODAL: "MODAL",
    SAVE_SUPPORT:"SAVE_SUPPORT"

};

// REDUCERS //
export const initialState = {
    loaded: false,
    showModal: false,
    currentModal: null,
    support: null,
    signs: null,
    okDisabled:false,
    showOk:true
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

        case types.MODAL:
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
    mapClicked: (geom, layers) => ({
        
        type: types.MAP_CLICKED,
        payload: {
            geom: geom,
            layers: layers
        }
    }),
    signOrderChanged: (features, support, layers) => ({
        type: types.SIGN_ORDER_CHANGED,
        payload: {
            features,
            support,
            layers

        }
    }),
    modalClicked: (show, type) => ({
        type: types.MODAL,
        payload: {
            showModal: show,
            currentModal: type
        }
    }),
    saveSupport:(support, layers)=>({
        type:types.SAVE_SUPPORT,
        payload:{
            support,
            layers
        }
    })

}
