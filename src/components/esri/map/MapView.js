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
    selPoint = {
        geometry: null
    };
    markerLayer = null;
    queryMarkerLayer = null;
    featureLayer = null;
    conicLayer = null;
    symb = null;
    addSymb = null;
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
            console.log('update due to view cone');
            return true;
        }

        if (this.props.graphic.queryFeatures.length > 0 && this.props.graphic.queryFeatures !== nextProps.graphic.queryFeatures) {
            console.log('update because of query features');
            return true;
        }
        if (this.props.graphic.needSupRefresh === true) {
            console.log('update to refresh for new support feature added');
            return true;
        }

        if (this.props.graphic.mapClickMode !== nextProps.graphic.mapClickMode) {
            console.log('update because mapClickMode changed')
            return true;
        }

        if (this.props.map.support !== nextProps.map.support) {
            console.log('update because map.support changed');
            return true
        }
        //removes superQuery results from view based on store
        if (nextProps.graphic.showQuery !== this.props.graphic.showQuery) {
            console.log('update because showQuery has changed');
            return true;
        }

        if(nextProps.graphic.ssOverlayFeatures === null & this.conicLayer.graphics.length > 0){
            console.log('update because view cone needs to be removed');
            return true;
        }
        console.log('did not update');
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.graphic.coneGraphic !== prevProps.graphic.coneGraphic) {
            console.log('changing cone');
            this
                .conicLayer
                .removeAll();
         /*   this
                .markerLayer
                .removeAll();  */
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
      
        if (this.props.graphic.showQuery === false && this.queryMarkerLayer.graphics.length > 0) {
            console.log('removing query markers')
            this
                .queryMarkerLayer
                .removeAll();
        }
        if (this.props.graphic.ssOverlayFeatures === null && this.conicLayer.graphics.length > 0 ) {
            console.log('removing conic graphics')
            this
                .conicLayer
                .removeAll();
        }

        //if there are query features in the store, this block displays them in the view
        if (this.props.graphic.queryFeatures.length > 0) {
            console.log('adding query features');
            const graphics = [...this.props.graphic.queryFeatures]
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

        if (this.props.graphic.needSupRefresh === true) {
            console.log('refershing support layer on map after add')
            this
                .featureLayer
                .refresh();
        }

        // updates marker use nextProps or this.props for the map clicks?  if bugs come
        // up , check this part
        if (this.props.graphic.mapClickMode === mapModes.SELECT_SUPPORT_MODE && !this.props.graphic.selSupportGeom) {
            console.log('not even sure why')
            return;
        }
        if (this.props.graphic.mapClickMode === mapModes.SELECT_SUPPORT_MODE && this.props.map.support !== prevProps.map.support) {

            console.log('changing selected support graphics in response to click')
            this.selPoint.geometry = this.props.graphic.selSupportGeom;
            this.selPoint.symbol = this.symb;
            this
                .markerLayer
                .removeAll();
            this
                .markerLayer
                .add(this.selPoint)

            this.view.zoom = 20
            this.view.center = this.selPoint.geometry
        } else if (this.props.graphic.mapClickMode === mapModes.ADD_SUPPORT_MODE) {
            //gonna try to keep the selected point in local state
            console.log('changing add support target graphic because of click')
            let addMark = {};
            addMark.geometry = this.state.newSupportClickGeom;
            addMark.symbol = this.addSymb;
            this
                .markerLayer
                .removeAll();
            this
                .markerLayer
                .add(addMark)
            //center, but no zoom      this.view.center = addMark.geometry
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
            .onMapClicked(expandedMapPoint, this.props.config.featureURLs);

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

                this.setState({newSupportClickGeom: evt.mapPoint});
                this
                    .props
                    .startStreetSmartViewer([newSupportFeature], this.props.config.featureURLs, 4326, 2248, this.props.graphic.viewWidth, this.props.graphic.viewExtentWidth, this.props.graphic.view_spatRef, true);

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
        loadModules(['esri/layers/FeatureLayer', "esri/layers/GraphicsLayer", 'esri/Graphic', "esri/layers/TileLayer", "esri/Basemap"]).then(([FeatureLayer, GraphicsLayer, Graphic, TileLayer, Basemap]) => {

            this.featureLayer = new FeatureLayer({url: this.props.config.featureURLs.supports, definitionExpression: "SUPPORTSTATUS = 1", outFields: ["*"], id: "support"});
            this.queryMarkerLayer = new GraphicsLayer();
            this.markerLayer = new GraphicsLayer();
            this.conicLayer = new GraphicsLayer();

            //     this.map.basemap = baseMap;
            this
                .map
                .addMany([this.featureLayer, this.queryMarkerLayer, this.markerLayer, this.conicLayer]);
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
