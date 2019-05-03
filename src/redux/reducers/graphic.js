export const types = {
    SET_SUPPORT_MARKER: "SET_SUPPORT_MARKER",
    QUERY_SUPERQUERY: "QUERY_SUPERQUERY",
    SET_QUERY_RESULTS: "SET_QUERY_RESULTS"
};

// REDUCERS //
export const initialState = {
    selSupportGeom:  null,
    queryFeatures :[]
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
            ...action.payload
        }
        default:
            return state;
    }
};

// ACTIONS //
export const actions = {
    setSupportMarker: (selSupportGeom) => ({
        
        type: types.SET_SUPPORT_MARKER,
        payload: {
            selSupportGeom
        }
    }),
    querySuperQuery:(where, extent, layer) =>({

        type:types.QUERY_SUPERQUERY,
        payload:{ where,extent,layer}
    })
};
