import {call, put, takeLatest} from 'redux-saga/effects';
import {types as mapTypes} from '../reducers/map';
import {types as graphicTypes} from '../reducers/graphic';

import {getFullSignPost} from './reload'
import {saveSupport, getPointOnRouteLRS, getSupportById} from '../../utils/JSAPI';

// WORKER //

function * addNewSupport(action) {
    try {

        //build a new , blank support to save
        let newSupport = {};
        newSupport.attributes = {
            ANGLE: null,
            BASETYPE: null,
            BLOCKID:null,
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
            SUBBLOCKID:null,
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

        //add LRS info

        const lrsResults = yield call(getPointOnRouteLRS, [newSupport, action.payload.layers.LRS_Service, 2248,26985]);
        const lrsInfo = lrsResults.data.pointOnRoutes[0];

        newSupport.attributes.ROUTEID = lrsInfo.routeID;
        newSupport.attributes.MEASURE = lrsInfo.measureInMeters;
        newSupport.attributes.STREETSEGID = lrsInfo.streetSegID;
        newSupport.attributes.BLOCKID = lrsInfo.blockId;
        newSupport.attributes.SUBBLOCKID = lrsInfo.subBlockId;


        //now let's project its geometry to its native preference

        /*      const antCraving = yield call(projectGeometry, [
            [newSupport.geometry],
            action.payload.layers.geometryService,
            2248,
            26985
        ])

        newSupport.geometry = antCraving[0];
*/

        const elLation = yield call(saveSupport, [newSupport, true, action.payload.layers.supports]);
        const features = yield call(getSupportById, [elLation.data.addResults[0].objectId, action.payload.layers.supports, 4326])
 
        action.payload.support = features.data.features[0];

        yield getFullSignPost(action);
        yield put({
            type: graphicTypes.NEED_SUPPORT_REFRESH_RG,
            payload: {
                needSupRefresh: true
            }
        })

    } catch (e) {

        console.log('SAGA ERROR: map/addNewSupport, ', e);
    }
}

// WATCHER //
export function * watchLayers() {

    yield takeLatest(mapTypes.NEW_SUPPORT_S, addNewSupport);
}
