export const types = {
    SET_SUPPORT_MARKER: "SET_SUPPORT_MARKER",
    QUERY_SUPERQUERY: "QUERY_SUPERQUERY",
    SET_QUERY_RESULTS: "SET_QUERY_RESULTS",
    REMOVE_QUERY_RESULTS: "REMOVE_QUERY_RESULTS",
    REMOVE_QUERY_GRAPHICS: 'REMOVE_QUERY_GRAPHICS',
    SHOW_STREETSMART_VIEWER: 'SHOW_STREETSMART_VIEWER',
    SHOW_STREETSMART_EDITOR: "SHOW_STREETSMART_EDITOR",
    START_STREETSMART_VIEWER: "START_STREETSMART_VIEWER",
    CLOSE_STREETSMART_VIEWER: "CLOSE_STREETSMART_VIEWER",
    SET_POINT_BUFFER: "SET_POINT_BUFFER"
};

// REDUCERS //
export const initialState = {
    selSupportGeom: null,
    queryFeatures: [],
    showQuery: false,
    leftVisible: false,
    ssEdit: false,
    ssView: false,
    ssInputGeom: null,
    viewWidth:null,
    viewExtentWidth:null,
    ssOverlayFeatures:null
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
    closeStreetSmartViewer: () =>({type:types.CLOSE_STREETSMART_VIEWER,payload:{}}),
    setPointBuffer: (viewWidth, viewExtentWidth) =>({type:types.SET_POINT_BUFFER, payload:{
        viewWidth,
        viewExtentWidth
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
    startStreetSmartViewer: (coords, layer, inSR, outSR) => ({
        type: types.START_STREETSMART_VIEWER,
        payload: {
            coords,
            layer,
            inSR,
            outSR
        }
    })
};
