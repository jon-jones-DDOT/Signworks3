import {loadModules} from 'esri-loader';

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
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json" // format
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
        loadModules(["esri/request"]).then(([esriRequest]) =>  {   
            let set = null;
            if (isNew) {
                set = {f:"json",
                    addFeatures: [updateFeature]
                };
            } else {
                set = { f:"json",
                    updateFeatures: [updateFeature]
                }
            }
            esriRequest(layer + '/applyEdits', {
                method: 'post',
                query: set
                }
            ).then(resp => resolve(resp), error => reject(error))

          /*  const id = this
                .supportLayer
                .applyEdits(set)
                .then(function (rslt) {
                    let fakeBanner = {
                        clickEvent: "selectSupport"
                    };
                    let evt = null;
                    if (!isNew) {
                        if (rslt.updateFeatureResults[0].error) {
                            alert(rslt.updateFeatureResults[0].error.message);
                        } else {
                            evt = {
                                id: rslt.updateFeatureResults[0].objectId
                            };
                        }
                    } else {
                        if (rslt.addFeatureResults[0].error) {
                            alert(rslt.addFeatureResults[0].error.message);
                        } else {
                            evt = {
                                id: rslt.addFeatureResults[0].objectId
                            };
                        }
                    }

                });
            */  })
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