import {call, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {getFullSignPost} from './reload'
import {saveSupport, getPointOnRouteStreetSmart} from '../../utils/JSAPI';

// WORKER //

function * addNewSupport(action) {
    try {

        //build a new , blank support to save
        let newSupport = {};
        newSupport.attributes = {
            ANGLE: null,
            BASETYPE: null,
            COMMENTS: null,
            CREATED_DATE: null,
            CREATED_USER: null,
            FROMDATE: null,
            GLOBALID: null,
            LAST_EDITED_DATE: null,
            LAST_EDITED_USER: null,
            LOCATION: null,
            MEASURE: null,
            MSENDDATE: null,
            MSSTARTDATE: null,
            MSUTILITYID: null,
            NUMBEROFBASES: null,
            OBJECTID: null,
            ORIGIN_ID: null,
            ROUTEID: null,
            ROUTEID_ALT: null,
            SEG_DIR: null,
            SIDE: null,
            STREETSEGID: null,
            STREETSEGID_ALT: null,
            SUBBASE: null,
            SUPPORTHEIGHT: null,
            SUPPORTSTATUS: 1,
            SUPPORTTYPE: 14,
            TODATE: null,
            Z: null
        }
        newSupport.setAttributes = function (a) {
            this.attributes = a;
            return this
        };
        newSupport.geometry = {
            type: "point", // autocasts as new Point()
            x: action.payload.support.features[0].geometry.coordinates[0],
            y: action.payload.support.features[0].geometry.coordinates[1],
            z: action.payload.support.features[0].geometry.coordinates[2],
            spatialReference: {
                wkid: 2248
            }
        };
        console.log('newSupport :', newSupport);
        //add LRS info

        const lrsResults = yield call(getPointOnRouteStreetSmart, [newSupport,action.payload.layers.LRS_Service]);
        console.log('lrsResults', lrsResults)
        //  yield call(saveSupport, [action.payload.support, true,
        // action.payload.layers.supports]);  yield getFullSignPost(action);
    } catch (e) {
        console.log('SAGA ERROR: map/addNewSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {

    yield takeLatest(mapTypes.NEW_SUPPORT_S, addNewSupport);
}
