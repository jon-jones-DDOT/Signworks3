export const types = {
    SET_SUPPORT_MARKER: "SET_SUPPORT_MARKER"
};

// REDUCERS //
export const initialState = {
    selSupportGeom:  null
}

export default(state = initialState, action) => {
    switch (action.type) {
        case types.SET_SUPPORT_MARKER:
        action.payload.selSupportGeom.type = "point";
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
    })
};
