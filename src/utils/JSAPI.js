import { loadModules } from 'esri-loader';



const err = (e) =>{ alert ('an error occurred in JSAPI  ' + e.message)}

const getSupportLayer = () => {
    alert('geting souport layer')
    loadModules([   'esri/layers/FeatureLayer'])
    .then(([ FeatureLayer]) => {

     const fLayer =   new FeatureLayer({
        url: "https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/0", outFields: ["*"]
      });
      
      return fLayer;
    })
    .catch(err => {
      // handle any errors
      console.error(err);
    });
}


export function  getSupportById (args) {
  const id = args[0];
  const layer = args[1];
   
    loadModules([        "esri/tasks/support/Query"])
    .then(([Query]) => {
        let query = new Query();
        query.where = "OBJECTID = " + id;
        query.outFields = ["*"];
        query.returnGeometry = true;
      
        layer.queryFeatures(query).then(
            function (results) {
              
                if (results.features.length > 0) {
                   
                   return results.features[0];
                } else {
                    alert('support was not retrieved')
                }
            },
            err);

     
     
    })
    .catch(err => {
      // handle any errors
      console.error(err);
    });
}
 
export function getSupportByExtent(args) {
    const extent = args[0];
    const supportLayer = args[1];
 alert('in JSAPI')
    loadModules([
"esri/tasks/support/Query"
    ])
    .then( ([
Query
    ]) => {

        let query = new Query();
        query.geometry = extent;
        query.outFields = ["*"];
        query.returnGeometry = true;
    
        supportLayer.queryFeatures(query).then(
            function (results) {
                if (results.features.length > 0) {
                    alert('alleged results')
                }
            },
            err);
    });
   

}