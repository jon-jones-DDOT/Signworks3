export const types = {
    SET_SUPPORT_MARKER: "SET_SUPPORT_MARKER",
    QUERY_SUPERQUERY: "QUERY_SUPERQUERY",
    SET_QUERY_RESULTS: "SET_QUERY_RESULTS",
    REMOVE_QUERY_RESULTS: "REMOVE_QUERY_RESULTS",
    REMOVE_QUERY_GRAPHICS: 'REMOVE_QUERY_GRAPHICS',
    SHOW_STREETSMART_VIEWER: 'SHOW_STREETSMART_VIEWER',

    START_STREETSMART_VIEWER: "START_STREETSMART_VIEWER",
    CLOSE_STREETSMART_VIEWER: "CLOSE_STREETSMART_VIEWER",
    SET_POINT_BUFFER: "SET_POINT_BUFFER",
    SET_MAP_CLICK_MODE: "SET_MAP_CLICK_MODE"
};
export const mapModes = {
    SELECT_SUPPORT: 'SELECT_SUPPORT',
    ADD_SUPPORT: 'ADD_SUPPORT',
    DRAW: "DRAW"
}

// REDUCERS //
export const initialState = {
    selSupportGeom: null,
    queryFeatures: [],
    showQuery: false,
    leftVisible: false,
    editMode: true,
    ssInputGeom: null,
    ssgeoJSONselPoint: null,
    viewWidth: null,
    viewExtentWidth: null,
    view_spatRef: null,
    ssOverlayFeatures: null,
    cursor: 'default',
    mapClickMode: mapModes.SELECT_SUPPORT
}

export default(state = initialState, action) => {
    switch (action.type) {
        case types.SET_SUPPORT_MARKER:
            action.payload.selSupportGeom.type = "point";
            return {
                ...state,
                ...action.payload
            }
        case types.SET_QUERY_RESULTS:
            return {
                ...state,
                ...action.payload,
                showQuery: true
            }
        case types.REMOVE_QUERY_RESULTS:
            return {
                ...state,
                queryFeatures: []

            }
        case types.REMOVE_QUERY_GRAPHICS:
            return {
                ...state,
                ...action.payload
            }
        case types.SET_POINT_BUFFER:
            return ({
                ...state,
                ...action.payload
            })
        case types.SHOW_STREETSMART_VIEWER:
            return {
                ...state,
                ...action.payload
            }
        case types.CLOSE_STREETSMART_VIEWER:
            return {
                ...state,
                ssEdit: false,
                ssView: false,
                leftVisible: false
            }
      
        case types.SET_MAP_CLICK_MODE:
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
    setSupportMarker: (selSupportGeom) => ({type: types.SET_SUPPORT_MARKER, payload: {
            selSupportGeom
        }}),
    removeQueryResults: () => ({type: types.REMOVE_QUERY_RESULTS, payload: {}}),
    closeStreetSmartViewer: () => ({type: types.CLOSE_STREETSMART_VIEWER, payload: {}}),
    setPointBuffer: (viewWidth, viewExtentWidth, view_spatRef) => ({
        type: types.SET_POINT_BUFFER,
        payload: {
            viewWidth,
            viewExtentWidth,
            view_spatRef
        }
    }),
    removeQueryGraphics: () => ({
        type: types.REMOVE_QUERY_GRAPHICS,
        payload: {
            showQuery: false
        }
    }),
    querySuperQuery: (where, extent, layer) => ({

        type: types.QUERY_SUPERQUERY,
        payload: {
            where,
            extent,
            layer
        }
    }),
 

    setMapClickMode: (mode, cursor) => ({
        type: types.SET_MAP_CLICK_MODE,
        payload: {
            mapClickMode: mode,
            cursor
        }
    }),
    startStreetSmartViewer: (sel, layers, inSR, outSR, viewWidth, viewExtentWidth, view_spatRef, editMode) => ({
        type: types.START_STREETSMART_VIEWER,
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
