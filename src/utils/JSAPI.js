import {loadModules} from 'esri-loader';

const err = (e) => {
    console.log('an error occurred in JSAPI  ' + e.message)
}

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

        loadModules(["esri/tasks/support/Query"]).then(([Query]) => {

            let query = new Query();
            query.geometry = extent;
            query.outFields = ["*"];
            query.returnGeometry = true;

            supportLayer
                .queryFeatures(query)
                .then(resp => resolve(resp), error => reject(error));
        });

    })
}

export function getRelatedSigns(args) {

    return new Promise((resolve, reject) => {
        const feature = args[0]
       
        const layer = args[1]

        loadModules(["esri/request"]).then(([esriRequest]) => {
            esriRequest(layer, {
                query: {
                    where: "SUPPORTID='" + feature.selSupport.attributes.GLOBALID + "'",
                    orderByFields:"SIGNORDER",
                    outFields: '*', // attribute fields to return
                    token: null, // token
                    f: "json" // format
                }
            }).then(resp => resolve(resp), error => reject(error));

        });
    })
}

export function saveSignOrder (args) {
    const features = args[0]
   
    return new Promise((resolve, reject) => {
        loadModules([ 
            "esri/request"
        ]).then(([
    esriRequest
         ]) => {
            esriRequest('https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/1/applyEdits', {
                method: 'post',
                query: {
                    f: "json", // format
                    "updates": JSON.stringify(features)
                }
            }).then(resp => resolve(resp), error => reject(error))
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