import {loadModules} from 'esri-loader';
import {call} from 'redux-saga/effects';
import LatLon from './geodesy/latlon-spherical';

export function getGroups(args) {
    const portal = args[0];
    const title = args[1];
    let queryParams = {

        query: "title:" + title,
        num: 50
    };
    return new Promise((resolve, reject) => {
        portal
            .queryGroups(queryParams)
            .then(resp => resolve(resp), error => reject(error));

    })
}

export function layerURLs(props) {

    if (props.auth.isDev) {

        return props.config.featureURLs_dev_edit;
    } else if (props.auth.isEditor) {

        return props.config.featureURLs_prod_edit;
    } else if (props.auth.isViewer) {

        return props.config.featureURLs_view;
    } else 
        return null;
    }

export function getSupportById(args) {
    const id = args[0];
    const layer = args[1];
    const outSR = args[2];

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
    console.log(where,geom,layer);

    return new Promise((resolve, reject) => {

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

export function getPointOnRouteLRS(args) {

    const point = args[0];

    const layer = args[1];

    const inSR = args[2];

    const outSR = args[3];

    return new Promise((resolve, reject) => {
        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer + '/getPointOnRoute', {
                query: {
                    'x': point.geometry.x,
                    'y': point.geometry.y,
                    'inSR': inSR,
                    'outSR': outSR,
                    'searchRadius': 50,
                    'f': "json"
                }
            }).then(resp => resolve(resp), error => reject(error))
        })
    })
}

export function calculateBearingPoints(args) {
    // wkid 4326 ONLY
    const pt1 = args[0];
    const pt2 = args[1];
    const lat1 = pt1.y;
    const lat2 = pt2.y;
    let lon1 = pt1.x;
    let lon2 = pt2.x;

  
    const xscale = Math.cos(lat1 * Math.PI / 180);

    lon1 = lon1 * xscale;
    lon2 = lon2 * xscale;

    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;

    if (Math.abs(dlon) < 0.000000001) {

        if (dlat < 0) 
            return 180;
        else 
            return 0;
        }
    
    return Math.atan2(dlon, dlat) * 180 / Math.PI;

}

export function createTriangle(args) {
    const point = args[0]
    const imagePitch = args[1];
    const imageYaw = args[2];
    const source = args[3];
    let sourceColor;
    if (source ==="StreetSmart"){
        sourceColor = "blue";
    }
    else{
        sourceColor = "green"
    }

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
                let pictureMarkerSymbol = new SimpleMarkerSymbol({style: "triangle", color: "black", size: "10px"});
                let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(sourceColor), 2), new Color(sourceColor));

                pictureMarkerSymbol.angle = imageYaw;
                let radius = 45;

                radius = radius - (Math.abs(imagePitch) / 2);

                // coneLayer.removeAll();

                let bob = new LatLon(point[0].y, point[0].x);
                console.log('bob', bob)

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

export async function getLocation2(args) {
    // in the old version I coded stuff for it to take roadways and street segments
    // not sure where I was going with that , but I will code it now to be able to
    // expand if those come back up as requests. so args[1] will always be 'address'
    const proxy = "http://ddotgisapp02/proxy/proxy.ashx?"
  
    let baseUrl = proxy + "http://citizenatlas.dc.gov/newwebservices/locationverifier.asmx";
    if (args[1] === "address") {
        baseUrl += "/findLocation2?f=json&str=" + args[0];
    }

    try {
  
        const response = await fetch(baseUrl);
        if (response.ok) {
            const results = await response.json();
            return results;
        }
    } catch (err) {
        console.log('err', err)
        console.error('Something went wrong with MAR');
        throw new Error('Bad stuff happened. In MAR');
    }
}