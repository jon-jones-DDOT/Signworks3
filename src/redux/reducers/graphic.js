export const types = {
    SET_SUPPORT_MARKER: "SET_SUPPORT_MARKER"
};

// REDUCERS //
export const initialState = {
    selSupportGeom: {type:'point', longitude:-76.98, latitude:38.888686} //{x:-76.98, y:38.888686}
};

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
