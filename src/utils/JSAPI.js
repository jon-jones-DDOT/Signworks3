import {loadModules} from 'esri-loader';
import {call} from 'redux-saga/effects';
import LatLon from './geodesy/latlon-spherical';

const err = (e) => {
    console.log('an error occurred in JSAPI  ' + e.message)
}

//currently not being used, needs a slight rewrite
export function getSupportById(args) {
    const id = args[0];
    const layer = args[1];
    const outSR = args[2];
    //needs a Promis here
    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + '/query', {
                query: {
                    where: "OBJECTID = " + id,
                    returnGeometry: true,
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json",
                    outSR: outSR // format

                }
            }).then(resp => resolve(resp), error => reject(error));

        });
    })

}

export function getSupportByExtent(args) {
    return new Promise((resolve, reject) => {

        const extent = args[0];

        const supportLayer = args[1];

        const outSR = args[2];

        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(supportLayer + '/query', {
                query: {
                    geometry: JSON.stringify(extent),
                    returnGeometry: true,
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json", // format
                    outSR: outSR
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

    const coords = args[0]; //array

    const layer = args[1];
    const inSR = args[2];
    const outSR = args[3]

    return new Promise((resolve, reject) => {
        loadModules(["esri/tasks/GeometryService", "esri/tasks/support/ProjectParameters", "esri/geometry/Point", "esri/geometry/SpatialReference"]).then(([GeometryService, ProjectParameters, Point, SpatialReference]) => {
            const outS = new SpatialReference(outSR);

            const gS = new GeometryService({url: layer});
            const inSpatRef = new SpatialReference(inSR);

            let geoms = [];

            for (let i = 0; i < coords.length; i++) {
                const pt = new Point({latitude: coords[i].y, longitude: coords[i].x, spatialReference: inSpatRef})

                geoms.push(pt)
            }

            const params = new ProjectParameters({geometries: geoms, outSpatialReference: outS})

            gS
                .project(params)
                .then(resp => resolve(resp), error => reject(error))

        })
    })
}

export function pointToExtentSaga(args) {

    const view_width = args[0];
    const view_extent_width = args[1];
    const view_spatialReference = args[2];

    const point = args[3];
    const toleranceInPixel = args[4];

    return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Extent", "esri/geometry/support/webMercatorUtils"]).then(([Extent, webMercatorUtils]) => {

            try {

                let mercPoint = null;

                if (point.spatialReference) {
                    if (point.spatialReference.wkid === 102100) {
                        mercPoint = point;
                    } else {
                        mercPoint = webMercatorUtils.geographicToWebMercator(point)
                    }

                } else {
                    mercPoint = webMercatorUtils.geographicToWebMercator(point)
                }
                //calculate map coords represented per pixel
                let pixelWidth = view_extent_width / view_width;

                //calculate map coords for tolerance in pixel
                let toleraceInMapCoords = toleranceInPixel * pixelWidth;
                const ext = new Extent(mercPoint.x - toleraceInMapCoords, mercPoint.y - toleraceInMapCoords, mercPoint.x + toleraceInMapCoords, mercPoint.y + toleraceInMapCoords, view_spatialReference);
                resolve(ext)
            } catch (error) {

                reject(error)
            }
        })
    })

}

export function pointToExtent(view_width, view_extent_width, view_spatialReference, point, toleranceInPixel, callback) {

    loadModules(["esri/geometry/Extent"]).then(([Extent]) => {

        //calculate map coords represented per pixel
        let pixelWidth = view_extent_width / view_width;

        //calculate map coords for tolerance in pixel
        let toleraceInMapCoords = toleranceInPixel * pixelWidth;
        //calculate & return computed extent

        callback(new Extent(point.x - toleraceInMapCoords, point.y - toleraceInMapCoords, point.x + toleraceInMapCoords, point.y + toleraceInMapCoords, view_spatialReference))

    })

}

export function createFeatureSet(args) {
    return new Promise((resolve, reject) => {
        loadModules(["esri/tasks/support/FeatureSet"]).then(([FeatureSet]) => {
            try {
                resolve(new FeatureSet({features: args[0]}))
            } catch (err) {
                reject(err)
            }
        })
    })
}

export function getPointOnRouteStreetSmart(args) {

    const point = args[0];

    const layer = args[1];

    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + '/getPointOnRoute', {
                query: {
                    'x': point.geometry.x,
                    'y': point.geometry.y,
                    'inSR': 2248,
                    'outSR': 26985,
                    'searchRadius': 50,
                    'f': "json"
                }
            }).then(resp => resolve(resp), error => reject(error))
        })
    })
}

export function createTriangle(args) {
    const point = args[0]
    const imagePitch = args[1];
    const imageYaw = args[2];
    console.log('imageYaw,imagePitch :', imageYaw, imagePitch);
    if (typeof point[0] == 'undefined') {
        return
    }
    return new Promise((resolve, reject) => {
        loadModules([
            "esri/Graphic",
            "esri/geometry/Polygon",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/Color"
        ]).then(([
            Graphic,
            Polygon,
            SimpleFillSymbol,
            SimpleLineSymbol,
            SimpleMarkerSymbol,
            Color
        ]) => {
            try {
                let pictureMarkerSymbol = new SimpleMarkerSymbol({style: "triangle", color: "blue", size: "10px"});
                let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 157, 0.0]), 2), new Color([0, 0, 157, 0.25]));

                pictureMarkerSymbol.angle = imageYaw;
                let radius = 45;

                radius = radius - (Math.abs(imagePitch) / 2);

                // coneLayer.removeAll();

                let bob = new LatLon(point[0].y, point[0].x);

                let portAzimuth = imageYaw - 55;
                if (portAzimuth < 0) {
                    portAzimuth += 360;
                }
                let starboardAzimuth = imageYaw + 55;
                if (starboardAzimuth > 360) {
                    starboardAzimuth -= 360;
                }
                let portPoint = bob.destinationPoint(radius, portAzimuth);
                let starboardPoint = bob.destinationPoint(radius, starboardAzimuth);

                const polygonJson = {
                    "rings": [
                        [
                            [
                                point[0].x, point[0].y
                            ],
                            [
                                portPoint.lon, portPoint.lat
                            ],
                            [starboardPoint.lon, starboardPoint.lat]
                        ]
                    ],
                    "spatialReference": {
                        "wkid": 4326
                    }
                };
                symbol.color.a = .5 - (imagePitch * .01) / 2;
                let polygon = new Polygon(polygonJson);
                let graf = new Graphic(polygon, symbol)
                // coneLayer.add(graf);
                let pt = new Graphic(point[0], pictureMarkerSymbol);
                //  coneLayer.add(pt);
                resolve([graf, pt])
            } catch (err) {
                reject(err)
            }

        })
    })
    //   mp = point;

    /*







*/
};

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