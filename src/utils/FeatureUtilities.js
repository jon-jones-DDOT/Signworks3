define(["esri/tasks/support/Query",
 "esri/layers/FeatureLayer", 
 "esri/geometry/Polygon"], function (Query, FeatureLayer, Polygon) {

    //this is a singleton object
    return {

        //value needs to be a string!
        getFeatureSymbol: function (layer, value) {
            return { url: null };
            var infos = layer.renderer.infos;
            for (var i = 0; i < infos.length; i++) {
                if (infos[i].value === value) {
                    return infos[i].symbol;
                }
            }
            return infos[0].symbol;
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
        addOptionsToSelectFromFeatureSet: function (sel, features, textColumn, valueColumn, selIdx, firstNull) {
            var option = document.createElement("option");
            var j = 0;
            if (firstNull) {

                option.text = "";
                option.value = "";
                sel.add(option);
                j++;
            }

            for (var i = 0; i < features.length; i++) {

                option = document.createElement("option");
                option.text = features[i].attributes[textColumn];
                if (valueColumn == "SHAPE") {
                    option.value = JSON.stringify(features[i].geometry);
                }
                else
                    option.value = features[i].attributes[valueColumn];
                sel.add(option);
            }

        },
        getCodedValues: function (fields, fieldName, filter) {
         //   var layerMetadata = layer.toJson();
         //  var fields = layerMetadata.layerDefinition.fields;


            var field;
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


                    }
                    catch (err) {
                        alert(err.message);
                    }
                };

                return BetterCodedValue;
            }


        },

        checkImageURL: function (url) {
            var img = new Image();
            img.src = url;
            setTimeout(function () {

                if (img.height != 0) {
                    return url;
                }
                else
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
                "features": [
                  {
                      "attributes": {},
                      "geometry": { "rings": null }
                  }
                ]
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
        }
    }
});
