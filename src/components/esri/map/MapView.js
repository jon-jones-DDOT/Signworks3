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
// ESRI
import {loadModules} from 'esri-loader';
import {createView} from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';

import {pointToExtent} from '../../../utils/JSAPI';

const Container = styled.div `
  height: 100%;
  width: 100%;
`;

// Variables
const containerID = "map-view-container";

class MapView extends Component {
    selPoint = null;
    markerLayer = null;
    queryMarkerLayer = null;
    featureLayer = null;
    symb = null;
    addSymb = null;
    geom = null;


    constructor(props) {
        super(props)
        this.state = {newSupportClickGeom:null}
        
    }
    componentDidMount() {

        this.startup(this.props.mapConfig, containerID, this.props.is3DScene);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Tell React to never update this component, that's up to us
        return false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //removes superQuery results from view based on store
        if (nextProps.graphic.showQuery === false) {
            this.queryMarkerLayer.removeAll();
        }
        //if there are query features in the store, this block displays them in the view
        if (nextProps.graphic.queryFeatures.length > 0) {
            const graphics = [...nextProps.graphic.queryFeatures]
            // add symbols
            let querySymb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()  NEVER TRUST AUTOCAST
                style: "circle",
                color: [
                    0, 255, 0, 0.0
                ],
                size: "30px", // pixels
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

       if(nextProps.graphic.needSupRefresh === true){
           this.featureLayer.refresh();
       }
        // updates marker use nextProps or this.props for the map clicks?  if bugs come
        // up , check this part
        if (nextProps.graphic.mapClickMode === mapModes.SELECT_SUPPORT_MODE) {

            this.selPoint.geometry = nextProps.graphic.selSupportGeom;
            this.selPoint.symbol = this.symb;
            this
                .markerLayer
                .removeAll();
            this
                .markerLayer
                .add(this.selPoint)

         //   this.view.zoom = 20
 
            this.view.center = this.selPoint.geometry
        } else if (this.props.graphic.mapClickMode === mapModes.ADD_SUPPORT_MODE) {
            //gonna try to keep the selected point in local state
            let addMark = {};
            addMark.geometry = this.state.newSupportClickGeom;
            addMark.symbol = this.addSymb;
            this.markerLayer.removeAll();
            this.markerLayer.add(addMark)
            //center, but no zoom
            this.view.center = addMark.geometry
        }
        else{
            this.markerLayer.removeAll();
        }

        this.view.surface.style.cursor = nextProps.graphic.cursor;
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
            .onMapClicked(expandedMapPoint, this.props.config.featureURLs);

    }

    mapClickHandler = (evt) => {

        // in any map app that's more than a viewer, the map click event is gonna be
        // complicated so much so that I wrote this a month ago and it is already
        // getting away from me so we shall comment.  The click event is first captured
        // here then evaluated against the store to decide what it is supposed to do
        switch (this.props.graphic.mapClickMode) {
                //the click is supposed to select an existing support on the map
            case mapModes.SELECT_SUPPORT_MODE:

                // this redux call moves info about the view into the store so that an extent
                // around the point can be calculated I don't think it changes, (todo) see about
                // moving it to map load or something
                this
                    .props
                    .setPointBuffer(this.view.width, this.view.extent.width, this.view.spatialReference);
                // this creates a small extent buffer around the mapPoint to aid in the select
                // query its callback is getSelectedSupport, above
                pointToExtent(this.view.width, this.view.extent.width, this.view.spatialReference, evt.mapPoint, 12, this.getSelectedSupport);
                break;
                //ok now we are in add support mode
            case mapModes.ADD_SUPPORT_MODE:
                // we should create a 'fake' feature out of the map click event

                const newSupportFeature = {
                    atrributes: {},
                    geometry: {
                        x: evt.mapPoint.longitude,
                        y: evt.mapPoint.latitude,
                        type: 'point'
                    }
                }
                //grabbing a local copy of the mapPoint.geom for the marker
       
                this.setState({newSupportClickGeom:evt.mapPoint})
                this
                    .props
                    .startStreetSmartViewer([newSupportFeature], this.props.config.featureURLs,
                         4326, 2248, this.props.graphic.viewWidth, this.props.graphic.viewExtentWidth,
                          this.props.graphic.view_spatRef, true);

                break;
            default:
                return

        }

    }

    mapMoveHandler = (evt) => {
  console.log('this.view.zoom', this.view.zoom)
        this
            .props
            .onMapChanged(this.view.extent);
    }

    init = (response) => {
        this.view = response.view
        this.map = response.view.map;
        console.log('this.view.zoom on init :', this.view.zoom);
    }

    setupWidgetsAndLayers = () => {
        loadModules(['esri/layers/FeatureLayer', "esri/layers/GraphicsLayer", 'esri/Graphic', "esri/layers/TileLayer", "esri/Basemap"]).then(([FeatureLayer, GraphicsLayer, Graphic, TileLayer, Basemap]) => {
            const layerUrl = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/DC_Basemap_LightGray_W" +
                    "ebMercator/MapServer";
            const baselayer = new TileLayer(layerUrl, null);
            const baseMap = new Basemap({baseLayers: [baselayer]})

             this.featureLayer = new FeatureLayer({url: this.props.config.featureURLs.supports, definitionExpression: "SUPPORTSTATUS = 1", outFields: ["*"], id: "support"});
            this.queryMarkerLayer = new GraphicsLayer();
            this.markerLayer = new GraphicsLayer();

       //     this.map.basemap = baseMap;
            this
                .map
                .addMany([this.featureLayer, this.queryMarkerLayer, this.markerLayer]);
            this
                .view
                .on("click", this.mapClickHandler);

            this
                .view
                .on("pointer-up", this.mapMoveHandler);
            this
                .view
                .on('mouse-wheel', this.mapMoveHandler)

    

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

            this.selPoint = new Graphic({geometry: null, symbol: this.symb})

            //   this.markerLayer.add(this.selPoint)
        });
    }

}

const mapStateToProps = state => ({config: state.config, map: state.map, graphic: state.graphic});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
