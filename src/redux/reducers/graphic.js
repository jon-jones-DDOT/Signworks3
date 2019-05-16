export const types = {
    SET_SUPPORT_MARKER_RG: "SET_SUPPORT_MARKER_RG",
    QUERY_SUPERQUERY_S: "QUERY_SUPERQUERY_S",
    SET_QUERY_RESULTS_RG: "SET_QUERY_RESULTS_RG",
    REMOVE_QUERY_RESULTS_RG: "REMOVE_QUERY_RESULTS_RG",
    REMOVE_QUERY_GRAPHICS_RG: 'REMOVE_QUERY_GRAPHICS_RG',
    SHOW_STREETSMART_VIEWER_RG: 'SHOW_STREETSMART_VIEWER_RG',
    START_STREETSMART_VIEWER_S: "START_STREETSMART_VIEWER_S",
    CLOSE_STREETSMART_VIEWER_RG: "CLOSE_STREETSMART_VIEWER_RG",
    SET_POINT_BUFFER_RG: "SET_POINT_BUFFER_RG",
    SET_MAP_CLICK_MODE_RG: "SET_MAP_CLICK_MODE_RG"
};

export const mapModes = {
    SELECT_SUPPORT_MODE: 'SELECT_SUPPORT_MODE',
    ADD_SUPPORT_MODE: 'ADD_SUPPORT_MODE',
    DRAW_MODE: "DRAW_MODE"
}

// REDUCERS //
export const initialState = {
    selSupportGeom: null,
    queryFeatures: [],
    showQuery: false,
    leftVisible: false,
    editMode: null,
    ssInputGeom: null,
    ssgeoJSONselPoint: null,
    viewWidth: null,
    viewExtentWidth: null,
    view_spatRef: null,
    ssOverlayFeatures: null,
    cursor: 'default',
    mapClickMode: mapModes.SELECT_SUPPORT_MODE
}

export default(state = initialState, action) => {
    switch (action.type) {
        case types.SET_SUPPORT_MARKER_RG:
            action.payload.selSupportGeom.type = "point";
            return {
                ...state,
                ...action.payload
            }
        case types.SET_QUERY_RESULTS_RG:
            return {
                ...state,
                ...action.payload,
                showQuery: true
            }
        case types.REMOVE_QUERY_RESULTS_RG:
            return {
                ...state,
                queryFeatures: []

            }
        case types.REMOVE_QUERY_GRAPHICS_RG:
            return {
                ...state,
                ...action.payload
            }
        case types.SET_POINT_BUFFER_RG:
            return ({
                ...state,
                ...action.payload
            })
        case types.SHOW_STREETSMART_VIEWER_RG:
            return {
                ...state,
                ...action.payload
            }
        case types.CLOSE_STREETSMART_VIEWER_RG:
            return {
                ...state,
                ssEdit: false,
                ssView: false,
                leftVisible: false
            }
      
        case types.SET_MAP_CLICK_MODE_RG:
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
    setSupportMarker: (selSupportGeom) => ({type: types.SET_SUPPORT_MARKER_RG, payload: {
            selSupportGeom
        }}),
    removeQueryResults: () => ({type: types.REMOVE_QUERY_RESULTS_RG, payload: {}}),
    closeStreetSmartViewer: () => ({type: types.CLOSE_STREETSMART_VIEWER_RG, payload: {}}),
    setPointBuffer: (viewWidth, viewExtentWidth, view_spatRef) => ({
        type: types.SET_POINT_BUFFER_RG,
        payload: {
            viewWidth,
            viewExtentWidth,
            view_spatRef
        }
    }),
    removeQueryGraphics: () => ({
        type: types.REMOVE_QUERY_GRAPHICS_RG,
        payload: {
            showQuery: false
        }
    }),
    querySuperQuery: (where, extent, layer) => ({

        type: types.QUERY_SUPERQUERY_S,
        payload: {
            where,
            extent,
            layer
        }
    }),
 

    setMapClickMode: (mode, cursor) => ({
        type: types.SET_MAP_CLICK_MODE_RG,
        payload: {
            mapClickMode: mode,
            cursor
        }
    }),
    startStreetSmartViewer: (sel, layers, inSR, outSR, viewWidth, viewExtentWidth, view_spatRef, editMode) => ({
        type: types.START_STREETSMART_VIEWER_S,
        payload: {
            sel,
            layers,
            inSR,
            outSR,
            viewWidth,
            viewExtentWidth,
            view_spatRef,
            editMode
        }
    })
};
