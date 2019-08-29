






define(["esri/layers/FeatureLayer",
        "esri/tasks/support/Query",
        "esri/request",
        "esri/Graphic",
        "esri/tasks/support/FeatureSet",
        "https://unpkg.com/@esri/arcgis-to-geojson-utils",
        "esri/geometry/Polygon",

        "dojo/_base/declare"
    ],
    function (
        FeatureLayer,
        Query,
        esriRequest,
        Graphic,
        FeatureSet,
        ArcgisToGeojsonUtils,
        Polygon,
        declare

    ) {


        return declare(null, {

            //value needs to be a string!
            getFeatureSymbol: function (layer, value) {
                return {
                    url: null
                };
                var infos = layer.renderer.infos;
                for (var i = 0; i < infos.length; i++) {
                    if (infos[i].value === value) {
                        return infos[i].symbol;
                    }
                }
                return infos[0].symbol;
            },
            getStreetSmartGeoJSON: function (feature, webmercFeature, callback, viewOnly, caller) {
                // a little formatting of the data
                const PointsSLD = ' <?xml version="1.0"  encoding="ISO-8859-1"?><StyledLayerDescriptor  version="1.0.0"             xsi:schemaLocation="http://www.opengis.net/sld  StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><NamedLayer><Name>Simple  point  with  stroke</Name><UserStyle><Title>GeoServer  SLD  Cook  Book:  Simple  point  with  stroke</Title><FeatureTypeStyle><Rule><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><CssParameter  name="fill">#FF0000</CssParameter></Fill><Stroke><CssParameter  name="stroke">#000000</CssParameter><CssParameter  name="stroke-width">2</CssParameter></Stroke></Mark><Size>6</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
                const selectSLD = '<?xml version="1.0"  encoding="ISO-8859-1"?><StyledLayerDescriptor  version="1.0.0"             xsi:schemaLocation="http://www.opengis.net/sld  StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><NamedLayer><Name>Simple  point  with  stroke</Name><UserStyle><Title>GeoServer  SLD  Cook  Book:  Simple  point  with  stroke</Title><FeatureTypeStyle><Rule><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><CssParameter  name="fill">#00000000</CssParameter><CssParameter name="fill-opacity">0.2</CssParameter></Fill><Stroke><CssParameter  name="stroke">#E633FF</CssParameter><CssParameter  name="stroke-width">2</CssParameter></Stroke></Mark><Size>12</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

                // begin the dance
                //this part builds a FeatureSet with the projected(2248) point to convert to geoJSON for use in StreetSmart as an overlay
                let selectPoint = null;
                if (viewOnly) {
                    let selectedGraphic = new Graphic();
                    selectedGraphic.attributes = [];
                    selectedGraphic.geometry = feature[0];
                    let features = [];
                    features.push(selectedGraphic);
                    let selectFeatureSet = new FeatureSet();
                    selectFeatureSet.features = features;
                    selectPoint = ArcgisToGeojsonUtils.arcgisToGeoJSON(selectFeatureSet);
                }
                // build query to get nearby supports based on extent made from webMerc feature
                let geojsonQuery = new Query();
                geojsonQuery.returnGeometry = true;
                geojsonQuery.geometry = graphics.pointToExtent46(graphics.view, webmercFeature, 200);
                geojsonQuery.outSpatialReference = {
                    "wkid": 2248
                };
                // convert selected point (2248) to geoJSON

                //query support layer to get nearby points
                this.supportLayer.queryFeatures(geojsonQuery).then(
                    function (results) {
                        // convert results to geoJSON
                        let gjPoints = ArcgisToGeojsonUtils.arcgisToGeoJSON(results);
                        //create options based on whether we are adding (no selected support) or just viewing 
                        let options = null;
                        if (viewOnly) {
                            options = [{
                                name: "Nearby Supports",
                                geojson: gjPoints,
                                sldXMLtext: PointsSLD
                            }, {
                                name: "Selected Support",
                                geojson: selectPoint,
                                sldXMLtext: selectSLD
                            }];
                        } else {
                            options = [{
                                name: "Nearby Supports",
                                geojson: gjPoints,
                                sldXMLtext: PointsSLD
                            }];
                        }

                        callback(options, feature, webmercFeature, caller);
                    },
                    this.err
                );



            },

            getPointOnRouteStreetSmart: function (point, callback, caller) {

                //      var soeURL = 'http://gisagsdevsvr02.dcgov.priv/dcgis/rest/services/DDOT/LRSSupport/MapServer/exts/DDOTLRSTools/getPointOnRoute';


                //      var soeURL = 'https://rh.dcgis.dc.gov/dcgis/rest/services/DDOT/LRSSupport/MapServer/exts/DDOTLRSTools/getPointOnRoute';
                let soeURL = 'https://dcdot.esriemcs.com/server/rest/services/RH/LRSSupport/MapServer/exts/DDOTLRSTools/getPointOnRoute';


                esriRequest(soeURL, {
                    query: {
                        'x': point.geometry.coordinates[0],
                        'y': point.geometry.coordinates[1],
                        'inSR': 2248,
                        'outSR': 26985,
                        'searchRadius': 50,
                        'f': "json"
                    }
                }).then(
                    function (response) {
                        if (response) {
                            callback(response.data.pointOnRoutes, caller);



                        }
                    }
                )
                /*       esriRequest({
                          url: soeURL,
                          content: content,
                          callbackParamName: "callback",
                          handleAs: "json",
                          load: function (response) {
                              if (response) {
                                  callback(response.pointOnRoutes);
                                   locations = response.pointOnRoutes;
                                 
                                 
                              }
                          },
                          error: function (error) {
                   
                          }
                      }); */
            },

            addOptionsToSelect: function (sel, codedValues, selIdx, firstNull) {
                var option = document.createElement("option");
                var j = 0;
                if (firstNull) {

                    option.text = "";
                    option.value = "";
                    sel.add(option);
                    j++;
                }
                for (var i = 0; i < codedValues._codedValue.length; i++) {
                    option = document.createElement("option");
                    option.text = codedValues._codedValue[i].name;
                    option.value = codedValues._codedValue[i].code;

                    sel.add(option);
                    if (selIdx && option.value === selIdx.toString())
                        sel.selectedIndex = i + j;
                };

            },

            addOptionsToSelectFromFeatureSet: function (sel, results, textColumn, valueColumn, selIdx, firstNull) {
                var option = document.createElement("option");
                var j = 0;
                if (firstNull) {

                    option.text = "";
                    option.value = "";
                    sel.add(option);
                    j++;
                }

                for (var i = 0; i < results.features.length; i++) {

                    option = document.createElement("option");
                    option.text = results.features[i].attributes[textColumn];
                    if (valueColumn == "SHAPE") {
                        option.value = JSON.stringify(results.features[i].geometry);
                    } else
                        option.value = results.features[i].attributes[valueColumn];
                    sel.add(option);
                }

            },

            getAllFeaturesFromLayer: function (layer, callback, colArray, control) {
                let sQuery = layer.createQuery();
                sQuery.outFields = colArray;
                layer.queryFeatures(sQuery).then(function (results) {
                    callback(results, control);
                });
            },

            getCodedValues: function (layer, fieldName, filter, callback) {

                //       var layerMetadata = layer.toJson();
                //      var fields = layerMetadata.layerDefinition.fields;
                let url = layer.url + "/" + layer.layerId + "?f=pjson";
                let fields = null;
                let data = this;
                esriRequest(url, {

                }).then(function (results) {
                    fields = results.data.fields;
                    let field = null;
                    for (var i = 0; i < fields.length; i++) {

                        if (fields[i].name === fieldName) {

                            field = fields[i];
                            break;
                        }
                    }

                    if (field === null)
                        return null;
                    if (field.domain != null) {

                        //need an object that can handle an undefined value as a parameter
                        var BetterCodedValue = {};
                        BetterCodedValue._codedValue = field.domain.codedValues;

                        if (filter) {
                            BetterCodedValue._codedValue = BetterCodedValue._codedValue.filter(filter);
                        }

                        BetterCodedValue.name = function (index) {

                            try {

                                for (var i = 0; i < this._codedValue.length; i++) {

                                    if (this._codedValue[i].code == index) {
                                        return this._codedValue[i].name;
                                    }
                                }

                                return "";
                            } catch (err) {
                                alert(err.message);
                            }
                        };

                        callback(data, field, BetterCodedValue);

                    }

                }, this.err);







            },

            checkImageURL: function (url) {
                var img = new Image();
                img.src = url;
                setTimeout(function () {

                    if (img.height != 0) {
                        return url;
                    } else
                        return "img/MUTCD/PR-OTHER.png";
                }, 250);

            },

            createMultipleWhereClause: function (field, values) {
                // may not work if values are integers or otherwise don't like the "'"
                var rtnString;
                rtnString = field + " = '" + values[0] + "'";
                for (var i = 1; i < values.length; i++) {

                    rtnString += " OR ";
                    rtnString += field + " = '" + values[i] + "'";
                }
                return rtnString;
            },

            createFeatureFromGeometry: function (geom, spatRef) {

                if (geom.type == "extent") {

                    geom = Polygon.fromExtent(geom);
                }

                feature = {

                    "geometryType": "esriGeometryPolygon",
                    "spatialReference": {},
                    "fields": [],
                    "features": [{
                        "attributes": {},
                        "geometry": {
                            "rings": null
                        }
                    }]
                };

                feature.spatialReference = geom.spatialReference;
                feature.features[0].geometry.rings = geom.rings;

                return feature;

            },

            getMultipleFeaturesByAttribute: function (layer, field, values, callback) {

                var myQuery = new Query();
                myQuery.where = this.createMultipleWhereClause(field, values);
                layer.selectFeatures(myQuery, FeatureLayer.SELECTION_NEW, function (features) {
                    callback(features);
                }, function (err) {
                    alert(err.message)
                });
            },

            signpostOutprocessing: function (callbacks, data, signpost) {
                //   alert(JSON.stringify(signpost));
                for (let i = 0; i < signpost.signs.length; i++) {
                    if (signpost.signs[i].timebands == null) {
                        return;
                    }
                }
                callbacks.signpostRenderer(signpost);
            },

            getRelatedTimebands: function (feature, callbacks) {


                esriRequest('https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/2/query', {
                    query: {
                        where: "SIGNID='" + feature.attributes.GLOBALID + "'",

                        outFields: '*', // attribute fields to return
                        token: null, // token
                        f: "json" // format
                    },
                }).then(function (results) {
                    callbacks.renderTimebands(results.data.features);

                }, this.err);
            },

            getRelatedSigns: function (feature, callbacks) {


                esriRequest('https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/1/query', {
                    query: {
                        where: "SUPPORTID='" + feature.attributes.GLOBALID + "'",
                        outFields: '*', // attribute fields to return
                        token: null, // token
                        f: "json" // format
                    }
                }).then(function (results) {
                    if (results.data.features) {


                        callbacks.renderSigns(results.data.features, feature.attributes.OBJECTID);
                    } else {
                  
                    }
                }, this.err);

            },

            getSupportByID: function (id, callbacks) {
                let query = new Query();
                query.where = "OBJECTID = " + id;
                query.outFields = ["*"];
                query.returnGeometry = true;

                this.supportLayer.queryFeatures(query).then(
                    function (results) {
                        if (results.features.length > 0) {
                            callbacks.renderSupport(results.features[0]);
                        } else {
                            alert('support was not retrieved')
                        }
                    },
                    this.err);

            },

            getSupportByExtent: function (extent, callbacks) {
                let query = new Query();
                query.geometry = extent;
                query.outFields = ["*"];
                query.returnGeometry = true;

                this.supportLayer.queryFeatures(query).then(
                    function (results) {
                        if (results.features.length > 0) {
                            callbacks.renderSupport(results.features[0]);
                        }
                    },
                    this.err);

            },

            getSuperQueryResults: function (query, callback) {
                superQueryLayer.queryFeatures(query).then(
                    function (results) {

                        callback(results, query.geometry);
                    }
                )
            },

            // getSupportByExtent should be rolled up into this someday
            
            getFeatureByExtent: function (layer, extent, callback) {
                let query = new Query();
                query.geometry = extent;
                query.outFields = ["*"];
                query.returnGeometry = true;

                layer.queryFeatures(query).then(
                    function (results) {
                        if (results.features.length > 0) {
                            callback(results.features[0]);
                        }
                    },
                    this.err);
            },

            saveSupport: function (updateFeature, isNew) {
                // bob = JSON.stringify(feature);
                let set = null;
                if (isNew) {
                    set = {
                        addFeatures: [updateFeature]
                    };
                } else {
                    set = {
                        updateFeatures: [updateFeature]
                    }
                }
                const id = this.supportLayer.applyEdits(set).then(

                    function (rslt) {
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
                        newPost(evt, fakeBanner);
                    });
            },

            saveSign: function (feature, timebandFeatures, supportId, isNew) {

                esriRequest('https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/1/applyEdits', {
                    method: 'post',
                    query: {
                        f: "json", // format
                        "updates": "[" + JSON.stringify(feature) + "]"
                    }
                }).then(

                    function (rslt) {
                        let evt = null;
                        if (rslt.data.updateResults == []) {
                            alert('the sign was not saved');
                        } else {
                            evt = {
                                id: supportId
                            };
                            esriRequest("https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/2/applyEdits", {
                                method: 'post',
                                query: {
                                    f: "json", // format
                                    "updates": JSON.stringify(timebandFeatures)
                                }
                            }).then(
                                function (rslt) {
                                    if (rslt.data.updateResults == []) {
                                        alert('the timeband[s] were not saved');
                                    } else {

                                        newPost(evt);
                                    }
                                }
                            )
                            //    newPost(evt);
                        }
                    }
                )

            },

            getCodedValuesAll: function () {
                this.getCodedValues(data.featureLayer, "MUTCD", "", data.setValues);
                this.getCodedValues(data.timebandLayer, "STARTDAY", "", data.setValues);
                this.getCodedValues(data.timebandLayer, "ENDDAY", "", data.setValues);
                this.getCodedValues(data.timebandLayer, "STARTTIME", "", data.setValues);
                this.getCodedValues(data.timebandLayer, "ENDTIME", "", data.setValues);
            },

            supportLayer: null,
            featureLayer: null,
            timebandLayer: null,
            err: null,
            muttValues: null,
            //timeband stuff
            startDayCodes: null,
            endDayCodes: null,
            startTimeCodes: null,
            endTimeCodes: null,
            hourCodes: null,
            setValues: function (data, field, values) {
                if (field.name == "MUTCD") {
                    data.muttValues = values;
                } else if (field.name == "STARTDAY") {
                    data.startDayCodes = values;
                } else if (field.name == "ENDDAY") {
                    data.endDayCodes = values;
                } else if (field.name == "STARTTIME") {
                    data.startTimeCodes = values;
                } else if (field.name == "ENDTIME") {
                    data.endTimeCodes = values;
                }
            },
            constructor: function (args) {
                this.supportLayer = args.supportLayer;
                this.featureLayer = args.featureLayer;
                this.timebandLayer = args.timebandLayer;
                this.hourCodes = {
                    _codedValue: [{
                        code: null,
                        name: ""
                    }, {
                        code: .25,
                        name: "15 min"
                    }, {
                        code: .5,
                        name: "30 min"
                    }, {
                        code: 1,
                        name: "1 hour"
                    }, {
                        code: 1.5,
                        name: "1.5 hour"
                    }, {
                        code: 2,
                        name: "2 hour"
                    }, {
                        code: 2.5,
                        name: "2.5 hour"
                    }, {
                        code: 3,
                        name: "3 hour"
                    }, {
                        code: 3.5,
                        name: "3.5 hour"
                    }, {
                        code: 4,
                        name: "4 hour"
                    }, {
                        code: 4.5,
                        name: "4.5 hour"
                    }, {
                        code: 5,
                        name: "5 hour"
                    }]
                };
                this.hourCodes.name = function (index) {
                    for (var i = 0; i < this._codedValue.length; i++) {

                        if (this._codedValue[i].code == index) {
                            return this._codedValue[i].name;
                        }
                    }
                };


                this.err = function (err) {
                    alert(err);
                };



            },
            parkingTypeSigns: ['R-NS-006', 'R-NS-011', 'R-NS-012', 'R-NS-013', 'R-NS-015', 'R-NS-017', 'R-NS-019', 'R-NS-022', 'R-NS-026', 'R-NS-038', 'R-NS-052', 'R-NS-053', 'R-NS-059',
                'R-NS-064', 'R-NS-075', 'R-NS-080', 'R-NS-121', 'R-NS-122', 'R-NS-131', 'R-NS-133', 'R-NS-141', 'R-NS-148', 'R-NS-172', 'R-NS-174', 'R-NS-180',
                'R-NS-185', 'R-NS-210', 'R-NS-215', 'R-NS-213', 'R-NS-214', 'R-NS-056', 'R-NS-LZSHARED', 'R-NS-OLD', 'R-NS_ROP', 'R-NS-RPP', 'R-DC-2HROLD', 'R-DC-2HROLD',
                'R-DC-2HR', 'R-DC-NSNP', 'R-DC-NSNP_EXCEPTION', 'R-DC-PTPCOIN', 'R-DC-Taxi_2', 'R-DC-NO_PARK_ENTRANCE_TIMES', 'R-DC-Diplomat', 'R-DC-No_Park_Russia_Embassy',
                'R-DC-No_Parking_Generic_w_Time', 'R-DC-Diplomat_Kazakhstan', 'R-DC-No_Stand_Bus', 'R-DC-Diplomat_Eq_Guinea', 'R-DC-Embassy _Angola', 'R-DC-Embassy _Diplomat_Mexico',
                'R-DC-15_Min_Parking1', 'R-DC-One_Hour_Parking_Eastern_Market', 'R-DC-School_Parking_Zone_15_Min',
                'R-DC-School_Loading_Zones2', 'R-DC-School_Loading_Zones3', 'R-DC-15_Min_Parking2', 'R-DC-Back_in_Parking',
                'R-NS-157', 'R-NS-120', 'R-DC-One_Way_Yellow', 'R-DC-Reserved_DCGov', 'D-NS-011', 'D-NS-038', 'D-NS-039', 'D-NS-055', 'R-NS-046', 'R-NS-134', 'R-DC-Hotel_Load', 'R-NS-LZPTL',
                'R-NS-LZSPECIAL', 'O-NS-024', 'R8-3', 'R8-3a'
            ],

            mphSigns: ["R2-1", "R2-1(5)", "R2-1(10)", "R2-1(15)", "R2-1(20)", "R2-1(25)", "R2-1(30)", "R2-1(35)", "R2-1(40)", "R2-1(45)", "R2-1(50)",
                "R2-1(55)", "R2-1(60)", "R2-1(65)", "R2-1(70)", "R2-1(75)",
                "R2-2", "R2-2P", "R2-3", "R2-3P", "R2-4", "R2-4P", "R2-4a", "R2-5B", "S5-1", "W1-1a", "W1-2a", "W13-1", "W13-2", "W13-3"
            ]

        });


    }); 