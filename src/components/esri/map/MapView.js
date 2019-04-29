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
    symb = null;
    componentDidMount() {
    
        this.startup(this.props.mapConfig, containerID, this.props.is3DScene);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Tell React to never update this component, that's up to us
        return false;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {

        if (this.selPoint) {
            this
                .markerLayer
                .removeAll();
            this.selPoint.geometry = nextProps.graphic.selSupportGeom;
            this
                .markerLayer
                .add(this.selPoint)
            this.view.zoom = 20
            this.view.center = this.selPoint.geometry

        }

    }
    geom = null;
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
            .onMapLoaded();
    }

    getSelectedSupport = (expandedMapPoint) => {
        this
            .props
            .onMapClicked(expandedMapPoint, this.props.config.featureURLs);

    }

    mapClicked = (evt) => {

        pointToExtent(this.view, evt.mapPoint, 12, this.getSelectedSupport);

    }

    init = (response) => {
        this.view = response.view
        this.map = response.view.map;
    }

    setupWidgetsAndLayers = () => {
        loadModules(['esri/layers/FeatureLayer', "esri/layers/GraphicsLayer", 'esri/Graphic', "esri/layers/TileLayer", "esri/Basemap"]).then(([FeatureLayer, GraphicsLayer, Graphic, TileLayer, Basemap]) => {
            const layerUrl = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/DC_Basemap_LightGray_WebMercator/MapServer";
            const baselayer = new TileLayer(layerUrl, null);
            const baseMap = new Basemap({baseLayers: [baselayer]})

            const featureLayer = new FeatureLayer({url: this.props.config.featureURLs.supports, outFields: ["*"], id: "support"});
            this.markerLayer = new GraphicsLayer();

            this.map.basemap = baseMap;
            this
                .map
                .addMany([featureLayer, this.markerLayer]);
            this
                .view
                .on("click", this.mapClicked);

           

          

            this.symb = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
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
