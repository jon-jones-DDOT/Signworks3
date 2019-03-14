define(["dojo/_base/declare",
    'dojo/dom-class',
    "esri/geometry/support/webMercatorUtils",
    "esri/geometry/SpatialReference",
    "esri/tasks/GeometryService",
    "esri/geometry/Extent",
    "esri/tasks/support/ProjectParameters",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/widgets/Sketch/SketchViewModel"


], function (declare,
    domClass,
    webMercatorUtils,
    SpatialReference,
    GeometryService,
    Extent,
    ProjectParameters,
    GraphicsLayer,
    Graphic,
    SketchViewModel

) {


    return declare(null, {
        getSketchViewModel: function (callback) {
            const addGraphic = function(event){
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: sketch.graphic.symbol
                  });
                  graphics.selGraphicsLayer.add(graphic);
                  callback(graphic);
            };

            let sketch = new SketchViewModel({
                view: graphics.view,
                layer: graphics.selGraphicsLayer,
                pointSymbol: {
                  type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                  style: "square",
                  color: "red",
                  size: "16px",
                  outline: {  // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 0],
                    width: 3
                  }
                },
                polylineSymbol: {
                  type: "simple-line",  // autocasts as new SimpleMarkerSymbol()
                  color: "#8A2BE2",
                  width: "4",
                  style: "dash"
                },
                polygonSymbol: {
                  type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
                  color: "rgba(138,43,226, 0.8)",
                  style: "solid",
                  outline: { // autocasts as new SimpleLineSymbol()
                    color: "white",
                    width: 1
                  }
                }
              });

              sketch.on("create-complete", addGraphic);
              return sketch;

        },

        getSelectedPointMarker: function (geom, color) {
            this.selGraphicsLayer.removeAll();
            let symb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                color: [0, 255, 0, 0.0],
                size: "30px", // pixels
                outline: { // autocasts as new SimpleLineSymbol()
                    color: color,
                    width: 3 // points
                }
            };
            let graphic = new Graphic({
                geometry: geom,
                symbol: symb
            });
            this.selGraphicsLayer.add(graphic);
        },

        pointToExtent314: function (map, point, toleranceInPixel) {
            //calculate map coords represented per pixel
            var pixelWidth = map.extent.getWidth() / map.width;
            //calculate map coords for tolerance in pixel
            var toleraceInMapCoords = toleranceInPixel * pixelWidth;
            //calculate & return computed extent
            return new esri.geometry.Extent(point.x - toleraceInMapCoords,
                point.y - toleraceInMapCoords,
                point.x + toleraceInMapCoords,
                point.y + toleraceInMapCoords,
                map.spatialReference);
        },

        pointToExtent46: function (view, point, toleranceInPixel) {
            //calculate map coords represented per pixel
            var pixelWidth = view.extent.width / view.width;
            //calculate map coords for tolerance in pixel
            var toleraceInMapCoords = toleranceInPixel * pixelWidth;
            //calculate & return computed extent
            return new Extent(point.x - toleraceInMapCoords,
                point.y - toleraceInMapCoords,
                point.x + toleraceInMapCoords,
                point.y + toleraceInMapCoords,
                view.spatialReference);
        },

        webMercatorToGeographic: function (geometry) {

            return webMercatorUtils.webMercatorToGeographic(geometry);
        },

        geographicToWebMercator: function (geometry) {

            return webMercatorUtils.geographicToWebMercator(geometry);
        },

        calculateBearingPoints: function (point1, point2) {
            if (point1.spatialReference.wkid == 102100 || point1.spatialReference.wkid == 3857) {
                point1 = this.webMercatorToGeographic(point1);
            }
            if (point2.spatialReference.wkid == 102100 || point2.spatialReference.wkid == 3857) {
                point2 = webMercatorUtils.webMercatorToGeographic(point2);
            }
            return this.calculateBearing(point1.y, point1.x, point2.y, point2.x);

        },

        calculateBearing: function (lat1, lon1, lat2, lon2) {

            var xscale = Math.cos(lat1 * Math.PI / 180);

            lon1 = lon1 * xscale;
            lon2 = lon2 * xscale;

            var dlon = lon2 - lon1;
            var dlat = lat2 - lat1;

            if (Math.abs(dlon) < 0.000000001) {

                if (dlat < 0)
                    return 180;
                else
                    return 0;
            }

            return Math.atan2(dlon, dlat) * 180 / Math.PI;
        },

        projectPoint: function (point, SR, callback, caller) {

            var params = new ProjectParameters();
            var gsvc = new GeometryService("https://dcdot.esriemcs.com/server/rest/services/Utilities/Geometry/GeometryServer");
            var errFunc = function (err) {

                alert(err);
            }
            params.geometries = [point];

            params.outSpatialReference = new SpatialReference(SR);
            gsvc.project(params).then(function (results) {
                    //point param for use with StreetSmart widget in addSupport mode
                    callback(results, caller, point)
                },
                errFunc)
        },

        projectGeometries: function (geom, SR, callback) {

            var params = new ProjectParameters();
            var gsvc = new GeometryService("https://arcgis.ddot.dc.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            var errFunc = function (err) {

                alert(err);
            }
            params.geometries = geom;

            params.outSR = new SpatialReference(SR);
            gsvc.project(params, callback, errFunc);
        },

        disableMain: function (on) {
            if (on) {
                domClass.add("main", "disabledApp")
            } else {
                domClass.remove("main", "disabledApp")
            }
        },

        disableEdit: function (on) {
            if (on) {
                domClass.add("editDiv", "disabledApp")
            } else {
                domClass.remove("editDiv", "disabledApp")
            }
        },

        disableSuperQuery: function (on) {
            if (on) {
                domClass.add("queryDiv", "disabledApp")
            } else {
                domClass.remove("queryDiv", "disabledApp")
            }
        },

        makeNewSupportGraphic: function (feature, newSupportGeom) {
            let newPoint = new Graphic({
                geometry: newSupportGeom,
                attributes: {
                    "OBJECTID": null,
                    "ROUTEID": feature.routeID,
                    "MEASURE": feature.measureInMeters,
                    "BASETYPE": null,
                    "COMMENTS": null,
                    "FROMDATE": null,
                    "TODATE": null,
                    "SUPPORTTYPE": 14,
                    "SUPPORTSTATUS": 1,
                    "SUPPORTHEIGHT": null,
                    "LOCATION": null,
                    "SUBBASE": null,
                    "NUMBEROFBASES": null,
                    "MSUTILITYID": null,
                    "MSSTARTDATE": null,
                    "MSENDDATE": null,
                    "CREATED_USER": null,
                    "CREATED_DATE": null,
                    "LAST_EDITED_USER": null,
                    "LAST_EDITED_DATE": null,
                    "GLOBALID": null,
                    "Z": null,
                    "ORIGINID": null,
                    "SIDE": null,
                    "ROUTEID_ALT": null,
                    "MANUAL_SEGID": null,
                    "SEG_DIR": null,
                    "ANGLE": null,
                    "STREETSEGID": feature.streetSegID
                }
            });

            newPoint.setAttributes = function (a) {
                this.attributes = a;
                return this
            };
            return newPoint;
        },

        createSuperQueryGraphics: function (features, extent) {
            graphics.selGraphicsLayer.removeAll();
            let sym = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                size: "20px",
                color: [0, 255, 0, 0.0], // autocasts as new Color()
                outline: { // autocasts as new SimpleLineSymbol()
                    style: "solid",
                    color: "blue", // Again, no need for specifying new Color()
                    width: "4px"
                }
            };



            for (let i = 0; i < features.features.length; i++) {
                try {
                    if (features.features[i].geometry != 'undefined') {
                        let graf = new Graphic(features.features[i].geometry, sym);
                        graphics.selGraphicsLayer.add(graf);
                    }
                } catch (err) {
                    alert(err + " " + i)
                }
            }

            if (extent.type == "polygon") {
                graphics.view.goTo(extent);
            }


        },

        createSelectedSuperQueryArea:function(geom){
            graphics.selGraphicsLayer.removeAll();
            let symbol = {
                type: "simple-fill",
                color:  [255, 255, 0, 0.25],
                style: 'solid',
                outline: {
                    color:  [255, 0, 0],
                    width: 1
                }
            };
            let graf = new Graphic(geom, symbol);
            graphics.selGraphicsLayer.add(graf);
            graphics.view.goTo(geom);
        },

        rightOffset: function (point, map) {
            //establish how wide the map is
            let width = Math.abs(map.extent.xmin - map.extent.xmax);
            //find point to the left of feature (or proposed feature)
            //  return new Point( point.x - (width * .35), point.y, point.spatialReference);
            let pt = {
                type: 'point',
                x: point.x - (width * .35),
                y: point.y,
                spatialReference: point.spatialReference
            };
            return pt;
        },

        addBox: function (geom, fillColor, outlineColor, pixels) {
            let symbol = {
                type: "simple-fill",
                color: fillColor,
                style: 'solid',
                outline: {
                    color: outlineColor,
                    width: 1
                }
            };
            let ext = this.pointToExtent46(this.view, geom, pixels);
            this.box = new Graphic({
                geometry: ext,
                symbol: symbol

            });
            this.selGraphicsLayer.remove(this.box);
            this.selGraphicsLayer.add(this.box);
            this.view.center = this.rightOffset(geom, this.view);
        },

        view: null,
        selGraphicsLayer: null,
        box: null,
        constructor (args) {

            this.view = args.view;
            this.selGraphicsLayer = new GraphicsLayer();
            this.view.map.add(this.selGraphicsLayer);


        }

    });


});