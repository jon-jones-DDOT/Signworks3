import {loadModules} from 'esri-loader';
import {call} from 'redux-saga/effects';

const err = (e) => {
    console.log('an error occurred in JSAPI  ' + e.message)
}

//currently not being used, needs a slight rewrite
export function getSupportById(args) {
    const id = args[0];
    const layer = args[1];
    //needs a Promis here

    loadModules(["esri/tasks/support/Query"]).then(([Query]) => {
        let query = new Query();
        query.where = "OBJECTID = " + id;
        query.outFields = ["*"];
        query.returnGeometry = true;

        layer
            .queryFeatures(query)
            .then(function (results) {

                if (results.features.length > 0) {

                    return results.features[0];
                } else {
                    alert('support was not retrieved')
                }
            }, err);

    }).catch(err => {
        // handle any errors
        console.error(err);
    });
}

export function getSupportByExtent(args) {
    return new Promise((resolve, reject) => {

        const extent = args[0];

        const supportLayer = args[1];

        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(supportLayer + '/query', {
                query: {
                    geometry: JSON.stringify(extent),
                    returnGeometry: true,
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json", // format
                    outSR: 4326
                }
            }).then(resp => resolve(resp), error => reject(error));

            /*     let query = new Query();
            query.geometry = extent;
            query.outFields = ["*"];
            query.returnGeometry = true;

            supportLayer
                .queryFeatures(query)
                .then(resp => resolve(resp), error => reject(error)); */
        });

    })
}

export function getRelatedSigns(args) {

    return new Promise((resolve, reject) => {
        const feature = args[0]

        const layer = args[1]

        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + "/query", {
                query: {
                    where: "SUPPORTID='" + feature.attributes.GLOBALID + "'",
                    orderByFields: "SIGNORDER",
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json" // format
                }
            }).then(resp => resolve(resp), error => reject(error));

        });
    })
}

export function getRelatedTimebands(args) {
    const layer = args[1]
    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + '/query', {
                query: {
                    where: "SIGNID='" + args[0].attributes.GLOBALID + "'",

                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json" // format
                }
            }).then(resp => resolve(resp), error => reject(error));
        })
    })

}

export function saveSignOrder(args) {
    const features = args[0];
    const layer = args[1];
    let pureFeatures = [];
    for (let i = 0; i < features.length; i++) {
        pureFeatures.push(features[i].feature)
    }

    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + '/applyEdits', {
                method: 'post',
                query: {
                    f: "json", // format
                    "updates": JSON.stringify(pureFeatures)
                }
            }).then(resp => resolve(resp), error => reject(error))
        })
    })

}

export function saveSupport(args/*updateFeature, isNew, layer */) {
    const updateFeature = args[0];

    const isNew = args[1];
    const layer = args[2];

    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            let set = null;
            if (isNew) {
                set = {
                    f: "json",
                    "adds": JSON.stringify([updateFeature])
                };
            } else {
                set = {
                    f: "json",
                    "updates": JSON.stringify([updateFeature])
                }
            }

            esriRequest(layer + '/applyEdits', {
                method: 'post',
                query: set
            }).then(resp => resolve(resp), error => reject(error))
        })
    })

}

export function saveTimebands(args) {
    const updateTimebands = args[0].editBands; //array
    const newTimebands = args[0].newBands; //array
    const deleteTimebands = args[0].deleteBands;
    const timebandLayer = args[1].timebands + "/applyEdits";

    const bandSet = {
        f: "json",
        "adds": JSON.stringify(newTimebands),
        "updates": JSON.stringify(updateTimebands),
        "deletes": JSON.stringify(deleteTimebands)
    };

    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(timebandLayer, {
                method: 'post',
                query: bandSet
            }).then(resp => resolve(resp), error => reject(error))
        })
    })
}

export function saveSign(args) {

    const updateSignFeature = args[0].sign;

    const isNew = args[1];
    const signLayer = args[2].signs + "/applyEdits";

    let signSet = null;

    if (isNew) {

        signSet = {
            f: "json",
            "adds": JSON.stringify([updateSignFeature])
        };
    } else {
        signSet = {
            f: "json",
            "updates": JSON.stringify([updateSignFeature])
        };
    }

    return new Promise((resolve, reject) => {

        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(signLayer, {
                method: 'post',
                query: signSet
            }).then(resp => resolve(resp), error => reject(error))

        }) // end of then for loadModules
    }) //end of promise

} // end of function

export function superQuery(args) {
    const where = args[0];
    const geom = args[1];
    const layer = args[2];

    return new Promise((resolve, reject) => {

        const extent = args[0];

        const supportLayer = args[1];

        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + '/query', {
                query: {
                    geometry: JSON.stringify(geom),
                    where: where,
                    returnGeometry: true,
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json", // format
                    outSR: 4326
                }
            }).then(resp => resolve(resp), error => reject(error))

        });

    })
}

export function projectGeometry(args) {
    const coords = args[0];
    
    const layer = args[1];
   

    return new Promise((resolve, reject) => {
        loadModules(["esri/tasks/GeometryService", "esri/tasks/support/ProjectParameters",
        "esri/geometry/Point", "esri/geometry/SpatialReference"]).then(([GeometryService, ProjectParameters,Point, SpatialReference]) => {
            const outS = new SpatialReference(2248);
            const gS = new GeometryService({url: layer});
            const inSpatRef = new SpatialReference(4326);
            const pt = new Point({latitude:coords.y,
            longitude:coords.x, 
        spatialReference:inSpatRef})
            const params = new ProjectParameters({geometries: [pt], outSpatialReference: outS})
         
            gS
                .project(params)
                .then(resp => resolve(resp), error => reject(error))

        })
    })
}

export function pointToExtent(view, point, toleranceInPixel, callback) {

    loadModules(["esri/geometry/Extent"]).then(([Extent]) => {

        //calculate map coords represented per pixel
        let pixelWidth = view.extent.width / view.width;

        //calculate map coords for tolerance in pixel
        let toleraceInMapCoords = toleranceInPixel * pixelWidth;
        //calculate & return computed extent

        callback(new Extent(point.x - toleraceInMapCoords, point.y - toleraceInMapCoords, point.x + toleraceInMapCoords, point.y + toleraceInMapCoords, view.spatialReference))

    })

}

//NON-ESRI DATA CALLS

export function * muttGenerator(muttQueryString) {
    yield call(getMUTCDS, [muttQueryString])
}

export async function getMUTCDS(args) {
    const baseUrl = "http://ddotgisapp01/SignCatalog/api/mutcd?code=" + args[0];

    try {
        const response = await fetch(baseUrl);
        if (response.ok) {
            const results = await response.json();
            return results;
        }
    } catch (err) {
        console.error('Something went wrong');
        throw new Error('Bad stuff happened.');
    }
}

export async function getAllMUTCDS() {
    const baseUrl = "http://ddotgisapp01/SignCatalog/api/mutcd"

    try {
        const response = await fetch(baseUrl);
        if (response.ok) {
            const results = await response.json();
            return results;
        }
    } catch (err) {
        console.error('Something went wrong');
        throw new Error('Bad stuff happened.');
    }
}