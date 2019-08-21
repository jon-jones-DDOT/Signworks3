// Copyright 2019 Esri Licensed under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
// or agreed to in writing, software distributed under the License is
// distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the specific language
// governing permissions and limitations under the License.​ ACTION TYPES //
export const types = {
    MAP_LOADED_S: "MAP_LOADED_S",
    SELECT_SUPPORT_S: "SELECT_SUPPORT_S",
    MAP_CHANGED_RM: "MAP_CHANGED_RM",
    SET_SELECTED_SUPPORT_RM: "SET_SELECTED_SUPPORT_RM",
    SIGN_ORDER_CHANGED_S: "SIGN_ORDER_CHANGED_S",
    MODAL_CLICKED_RM: "MODAL_CLICKED_RM",
    SAVE_SUPPORT_S: "SAVE_SUPPORT_S",
    SAVE_SIGN_S: "SAVE_SIGN_S",
    NEW_SIGN_S: "NEW_SIGN_S",
    NEW_SUPPORT_S: "NEW_SUPPORT_S",
    INIT_RM: "INIT_RM",
    SHOW_RETIRED_SIGNS_RM: "SHOW_RETIRED_SIGNS_RM",
    SHOW_RETIRED_POSTS_RM: "SHOW_RETIRED_POSTS_RM"

};

// REDUCERS //
export const initialState = {
    loaded: false,
    showModal: false,
    currentModal: null,
    support: null,
    signs: null,
    okDisabled: false,
    showOk: true,
    editSignIndex: NaN,
    muttArray: [],
    extent: null,
    retiredSigns: false,
    retiredPosts: 0
};

export default(state = initialState, action) => {

    switch (action.type) {
        case types.INIT_RM:
            return {
                ...state,
                ...action.payload,
                loaded: true
            };

        case types.SET_SELECTED_SUPPORT_RM:
            return {
                ...state,
                ...action.payload
            }

        case types.MODAL_CLICKED_RM:

            return {
                ...state,
                ...action.payload
            }
        case types.MAP_CHANGED_RM:
            return {
                ...state,
                ...action.payload
            }

        case types.SHOW_RETIRED_SIGNS_RM:
            return {
                ...state,
                ...action.payload
            }
            case types.SHOW_RETIRED_POSTS_RM:
                return{...state,...action.payload}

        default:
            return state;
    }
};

// ACTIONS //
export const actions = {
    mapLoaded: (extent) => ({type: types.MAP_LOADED_S, payload: {
            extent
        }}),
    mapChanged: (extent) => ({type: types.MAP_CHANGED_RM, payload: {
            extent
        }}),
    selectSupport: (geom, layers) => ({

        type: types.SELECT_SUPPORT_S,
        payload: {
            geom: geom,
            layers: layers
        }
    }),
    signOrderChanged: (features, support, layers) => ({
        type: types.SIGN_ORDER_CHANGED_S,
        payload: {
            features,
            support,
            layers

        }
    }),
    modalClicked: (show, type, index) => ({
        type: types.MODAL_CLICKED_RM,
        payload: {
            showModal: show,
            currentModal: type,
            editSignIndex: index
        }
    }),
    saveSupport: (support, layers) => ({
        type: types.SAVE_SUPPORT_S,
        payload: {
            support,
            layers
        }
    }),
    saveSign: (support, sign, layers) => ({
        type: types.SAVE_SIGN_S,
        payload: {
            support,
            sign,
            layers
        }
    }),

    newSign: (support, sign, layers) => ({
        type: types.NEW_SIGN_S,
        payload: {
            support,
            sign,
            layers
        }
    }),
    newSupport: (support,auth, layers) => ({
        type: types.NEW_SUPPORT_S,
        payload: {
            support,
            auth,
            layers
        }
    }),
    showRetiredSigns: (retiredSigns) => ({type: types.SHOW_RETIRED_SIGNS_RM, payload: {
            retiredSigns
        }}),
    showRetiredPosts: (retiredPosts) => ({type: types.SHOW_RETIRED_POSTS_RM, payload: {
            retiredPosts
        }})

}
