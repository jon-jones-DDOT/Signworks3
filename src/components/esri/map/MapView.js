// Copyright 2019 Esri Licensed under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
// or agreed to in writing, software distributed under the License is
// distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the specific language
// governing permissions and limitations under the License.​ NOTE This is a
// "special" react component that does not strictly play by React's rules.
//
// Conceptually, this component creates a "portal" in React by closing its
// render method off from updates (by simply rendering a div and never accepting
// re-renders) then reconnecting itself to the React lifecycle by listening for
// any new props (using componentWillReceiveProps) React
import React, {Component} from 'react';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../../redux/reducers/map';
import {actions as graphicActions} from '../../../redux/reducers/graphic'
import {mapModes} from '../../../redux/reducers/graphic'
import {leftKeys} from '../../../SignworksJSON'
// ESRI
import {loadModules} from 'esri-loader';
import {createView} from '../../../utils/esriHelper';
import cloneDeep from 'lodash.clonedeep';
// Styled Components
import styled from 'styled-components';

import {pointToExtent, layerURLs} from '../../../utils/JSAPI';

const Container = styled.div `
  height: 100%;
  width: 100%;
`;

// Variables
const containerID = "map-view-container";

class MapView extends Component {
    selPoint = {
        geometry: null
    };
    markerLayer = null;
    queryMarkerLayer = null;
    featureLayer = null;
    conicLayer = null;
    drawExtentLayer = null;
    symb = null;
    addSymb = null;
    marSymb = null;
    geom = null;

    constructor(props) {
        super(props)
        this.state = {
            newSupportClickGeom: null
        }

    }
    componentDidMount() {

        this.startup(this.props.mapConfig, containerID, this.props.is3DScene);
    }

    shouldComponentUpdate(nextProps, nextState) {

        //view cone needs adjustment
        if (this.props.graphic.coneGraphic !== nextProps.graphic.coneGraphic) {
            //    console.lg('update due to view cone');
            return true;
        }
        if (nextState.newSupportClickGeom !== this.state.newSupportClickGeom) {
            //        console.lg('update because map clicked to select target area for new
            // support')
            return true;
        }

        if (this.props.graphic.queryFeatures.length > 0 && this.props.graphic.queryFeatures !== nextProps.graphic.queryFeatures) {
            //        console.lg('update because of query features');
            return true;
        }
        if (this.props.graphic.needSupRefresh === true) {
            //       console.lg('update to refresh for new support feature added');
            return true;
        }

        if (this.props.graphic.mapClickMode !== nextProps.graphic.mapClickMode) {
            //        console.lg('update because mapClickMode changed.  Not sure this does
            // anything')
            return true;
        }

        if (this.props.map.support !== nextProps.map.support) {
            //         console.lg('update because map.support changed');
            return true
        }
        //removes superQuery results from view based on store
        if (nextProps.graphic.showQuery !== this.props.graphic.showQuery) {
          
            return true;
        }

        if (nextProps.graphic.ssOverlay === null & this.conicLayer.graphics.length > 0) {
            //     console.lg('update because view cone needs to be removed');
            return true;
        }

        if (nextProps.graphic.zoomPoint != this.props.graphic.zoomPoint) {

            return true;
        }
        if (nextProps.map.retiredPosts != this.props.map.retiredPosts) {
            return true;
        }
        //    console.lg('did not update');
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        // changes cone graphic in response to evt
        if (this.props.graphic.coneGraphic !== prevProps.graphic.coneGraphic) {

            this
                .conicLayer
                .removeAll();

            //   console.lg('unexpected call to cone graphics');
            this
                .queryMarkerLayer
                .removeAll();
            this
                .conicLayer
                .add(this.props.graphic.coneGraphic)
            this
                .conicLayer
                .add(this.props.graphic.conePointGraphic)
            return;
        }
        // removes all query graphics
        if (this.props.graphic.showQuery === false) {
            //      console.lg('removing query markers')
         
            this
               .queryMarkerLayer.removeAll();

               this.drawExtentLayer.removeAll();
             
        }
        //removes cone graphics
        if (this.props.graphic.ssOverlay === null && this.conicLayer.graphics.length > 0) {
            //      console.lg('removing conic graphics')
            this
                .conicLayer
                .removeAll();
        }

        //if there are query features in the store, this block displays them in the view
        if (this.props.graphic.queryFeatures.length > 0) {
            //       console.lg('adding query features');
            const graphics = [...this.props.graphic.queryFeatures]
            console.log( 'feature',graphics[0].geometry.spatialReference)
            console.log('view', this.view)
            if (graphics.length === 1){
                this.view.center = graphics[0].geometry;
            }
            else{
            //    this.view.extent = { spatialReference:{wkid:102100} ,xmax:-8551670.291734042, xmin:-8608119.037122568, ymax:4723978.545678767,ymin:4688091.360898926}
       
            this.view.extent = this.props.graphic.queryResultsExt;
           
            
            }
            // add symbols
            let querySymb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()  NEVER TRUST AUTOCAST
                style: "circle",
                color: [
                    0, 255, 0, 0.0
                ],
                size: "35px", // pixels
                outline: { // autocasts as new SimpleLineSymbol()
                    color: 'blue',
                    width: 3 // points
                }
            };

            //this just sets query results in the store to empty array
            this
                .props
                .removeQueryResults();
            // create graphics and add them to layer
            loadModules(["esri/Graphic"]).then(([Graphic]) => {
                let gr = null;
                for (let i = 0; i < graphics.length; i++) {
                    graphics[i].geometry.type = "point"
                    gr = new Graphic({geometry: graphics[i].geometry, symbol: querySymb})

                    this
                        .queryMarkerLayer
                        .add(gr)
                }

            })

        }

        //let's see if the support layer has been added to

        if (this.props.graphic.needSupRefresh === true) {
            //       console.lg('refershing support layer on map after add')
            this
                .featureLayer
                .refresh();
        }

        // updates marker use nextProps or this.props for the map clicks?  if bugs come
        // up , check this part
        if (this.props.graphic.mapClickMode === mapModes.SELECT_SUPPORT_MODE && !this.props.graphic.selSupportGeom) {
            //  console.lg('not even sure why')   return;
        }
        //changes map graphics when new support is selected
        if (this.props.graphic.mapClickMode === mapModes.SELECT_SUPPORT_MODE && this.props.map.support !== prevProps.map.support) {

            this.selPoint.geometry = this.props.graphic.selSupportGeom;
            if (this.props.graphic.leftKey === 1 || this.props.graphic.leftKey === leftKeys.SS_VIEW_REPEAT) {

                this
                    .props
                    .startStreetSmartViewer([this.selPoint], layerURLs(this.props), 4326, 2248, this.props.graphic.viewWidth, this.props.graphic.viewExtentWidth, this.props.graphic.view_spatRef, false, leftKeys.SS_VIEW_FIRST, this.props.map.retiredPosts)
            }

            this.selPoint.symbol = this.symb;
            this
                .markerLayer
                .removeAll();
            this
                .markerLayer
                .add(this.selPoint)

            this.view.zoom = 20

            this.view.center = this.selPoint.geometry
        } else if (this.props.graphic.mapClickMode === mapModes.ADD_SUPPORT_MODE && prevState.newSupportClickGeom !== this.state.newSupportClickGeom) {
            // gonna try to keep the selected point in local state console.lg('changing add
            // support target graphic because of click')
            let addMark = {};
            addMark.geometry = this.state.newSupportClickGeom;

            this.view.center = addMark.geometry;
            this.view.zoom = 19;
        }

        if (this.props.graphic.zoomPoint != prevProps.graphic.zoomPoint) {
            let marPoint = {};
            marPoint.geometry = cloneDeep(this.props.graphic.zoomPoint);

            marPoint.symbol = this.marSymb;

            this
                .queryMarkerLayer
                .removeAll();
            this
                .queryMarkerLayer
                .addMany([marPoint]);
            this.view.center = marPoint.geometry;
            this.view.zoom = 19;

        }
        if (this.props.map.retiredPosts != prevProps.map.retiredPosts) {

            if (this.props.map.retiredPosts === 2) {
                this.featureLayer.definitionExpression = ' SUPPORTSTATUS = 5'
            } else if (this.props.map.retiredPosts === 1) {
                this.featureLayer.definitionExpression = 'SUPPORTSTATUS = 1 OR SUPPORTSTATUS = 5'
            } else if (this.props.map.retiredPosts === 3) {
                this.featureLayer.definitionExpression = 'SUPPORTSTATUS = 627'
            } else {
                this.featureLayer.definitionExpression = "SUPPORTSTATUS = 1"
            }
        }

        this.view.surface.style.cursor = this.props.graphic.cursor;
    }

    render() {

        return (
            <Container ref="mapDiv" id={containerID}></Container>
        );
    }

    // ESRI JSAPI
    startup = (mapConfig, node, isScene = false) => {
        createView(mapConfig, node, isScene).then(response => {
            this.init(response);

            this.setupWidgetsAndLayers();
            this.finishedLoading();

        }, error => {
            console.error("maperr", error);
            window.setTimeout(() => {
                this.startup(mapConfig, node);
            }, 1000);
        })
    }

    finishedLoading = () => {
        // Update app state only after map and widgets are loaded
        this
            .props
            .onMapLoaded(this.view.extent);
    }

    getSelectedSupport = (expandedMapPoint) => {
        // this line takes the buffered point and sends it  to the map reducer which
        // punts it to the _setSupport saga which queries and gets the support, signs,
        // timebands, etc and writes them to the store, where they dictate the Rightbar
        // display.  Once the store changes the action picks up in willReceiveProps

        this
            .props
            .onMapClicked(expandedMapPoint, layerURLs(this.props));

    }


    mapClickHandler = (evt) => {
        // this redux call moves info about the view into the store so that an extent
        // around the point can be calculated I don't think it changes, (todo) see about
        // moving it to map load or something
        this
            .props
            .setPointBuffer(this.view.width, this.view.extent.width, this.view.spatialReference);

        // in any map app that's more than a viewer, the map click event is gonna be
        // complicated so much so that I wrote this a month ago and it is already
        // getting away from me so we shall comment.  The click event is first captured
        // here then evaluated against the store to decide what it is supposed to do
        switch (this.props.graphic.mapClickMode) {
                //the click is supposed to select an existing support on the map
            case mapModes.SELECT_SUPPORT_MODE:

                // this creates a small extent buffer around the mapPoint to aid in the select
                // query its callback is getSelectedSupport, above
                pointToExtent(this.view.width, this.view.extent.width, this.view.spatialReference, evt.mapPoint, 12, this.getSelectedSupport);
                break;
                //ok now we are in add support mode
            case mapModes.ADD_SUPPORT_MODE:
                // we should create a 'fake' feature out of the map click event console.lg('map
                // // click happens here')

                const newSupportFeature = {
                    atrributes: {},
                    geometry: {
                        x: evt.mapPoint.longitude,
                        y: evt.mapPoint.latitude,
                        type: 'point'
                    }
                }
                //grabbing a local copy of the mapPoint.geom for the marker

                this.setState({newSupportClickGeom: evt.mapPoint});
                this
                    .props
                    .startStreetSmartViewer([newSupportFeature], layerURLs(this.props), 4326, 2248, this.props.graphic.viewWidth, this.props.graphic.viewExtentWidth, this.props.graphic.view_spatRef, true);
                this
                    .props
                    .setMapClickMode(mapModes.SELECT_SUPPORT_MODE, 'default');
                this.view.surface.style.cursor = "default";
                break;
            case mapModes.DRAW_MODE:
                let draw,
                    action;
                const drawLayer = this.drawExtentLayer;
                const setMode = this
                .props
                .setMapClickMode;
                const setExtent = this.props.setQueryCustomExtent;
                const spatRef = this.view.spatialReference;

                loadModules(['esri/views/draw/Draw', "esri/Graphic"]).then(([Draw, Graphic]) => {

                    const createPolygonGraphic = function (vertices) {
                        drawLayer.removeAll();

                        var polygon = {
                            type: "polygon", // autocasts as Polygon
                            rings: vertices,
                            spatialReference: spatRef
                        };

                        var graphic = new Graphic({
                            geometry: polygon,
                            symbol: {
                                type: "simple-fill", // autocasts as SimpleFillSymbol
                                color: "purple",
                                style: "none",
                                outline: { // autocasts as SimpleLineSymbol
                                    color: "black",
                                    width: 1
                                }
                            }
                        });
                        drawLayer.add(graphic);
                        return graphic;
                    }

                    draw = new Draw({view: this.view});
                    action = draw.create("polygon", {mode: "click"});
                    // PolygonDrawAction.vertex-add Fires when user clicks, or presses the "F" key.
                    // Can also be triggered when the "R" key is pressed to redo.
                    action.on("vertex-add", function (evt) {
                        createPolygonGraphic(evt.vertices);
                    });
                    // PolygonDrawAction.vertex-remove Fires when the "Z" key is pressed to undo the
                    // last added vertex
                    action.on("vertex-remove", function (evt) {
                        createPolygonGraphic(evt.vertices);
                    });
                    // Fires when the pointer moves over the view
                    action.on("cursor-update", function (evt) {
                        createPolygonGraphic(evt.vertices);
                    });
                    // Add a graphic representing the completed polygon when user double-clicks on
                    // the view or presses the "C" key
                    action.on("draw-complete", function (evt) {
                        const rslt = createPolygonGraphic(evt.vertices);
                      
                        setExtent(rslt.geometry);
                       setMode(mapModes.SELECT_SUPPORT_MODE, 'default');
                        
                    });

                });

                break;
            default:
                return

        }

    }

    mapMoveHandler = (evt) => {
      
        this
            .props
            .onMapChanged(this.view.extent);
    }

    init = (response) => {
        this.view = response.view
        this.map = response.view.map;

    }

    setupWidgetsAndLayers = () => {
        loadModules(['esri/layers/FeatureLayer', "esri/layers/GraphicsLayer", 'esri/Graphic']).then(([FeatureLayer, GraphicsLayer, Graphic]) => {

            this.featureLayer = new FeatureLayer({
                url: layerURLs(this.props).supports,
                definitionExpression: "SUPPORTSTATUS = 1",
                outFields: ["*"],
                id: "support"
            });
            this.queryMarkerLayer = new GraphicsLayer();
            this.markerLayer = new GraphicsLayer();
            this.conicLayer = new GraphicsLayer();
            this.drawExtentLayer = new GraphicsLayer();

            //     this.map.basemap = baseMap;
            this
                .map
                .addMany([this.featureLayer, this.queryMarkerLayer, this.markerLayer, this.conicLayer, this.drawExtentLayer]);
            this
                .view
                .on("click", this.mapClickHandler);

            this
                .view
                .on("pointer-up", this.mapMoveHandler);
            this
                .view
                .on('mouse-wheel', this.mapMoveHandler);
                this.view.on("resize", this.mapMoveHandler)

            this.symb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                color: [
                    0, 255, 0, 0.0
                ],
                size: "30px", // pixels
                outline: { // autocasts as new SimpleLineSymbol()
                    color: 'magenta',
                    width: 3 // points
                }
            };
            this.addSymb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                color: [
                    0, 255, 0, 0.0
                ],
                size: "30px", // pixels
                outline: { // autocasts as new SimpleLineSymbol()
                    color: 'green',
                    width: 3 // points
                }
            };
            this.marSymb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "square",
                color: [
                    0, 255, 0, 0.0
                ],
                size: "30px", // pixels
                outline: { // autocasts as new SimpleLineSymbol()
                    color: 'green',
                    width: 3 // points
                }
            };

            this.selPoint = new Graphic({geometry: null, symbol: this.symb})

            //   this.markerLayer.add(this.selPoint)
        });
    }

}

const mapStateToProps = state => ({config: state.config, auth: state.auth, map: state.map, graphic: state.graphic});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
