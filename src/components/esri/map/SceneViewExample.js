// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// NOTE
// This is a "special" react component that does not strictly play by
// React's rules.
//
// Conceptually, this component creates a "portal" in React by
// closing its render method off from updates (by simply rendering a div and
// never accepting re-renders) then reconnecting itself to the React lifecycle
// by listening for any new props (using componentWillReceiveProps)

// React
import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../../../redux/reducers/map';

// ESRI
import { loadModules } from 'esri-loader';
import { createView } from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

// Variables
const containerID = "map-view-container";

class SceneViewExample extends Component {

  componentDidMount() {
    this.startup(
      this.props.mapConfig,
      containerID,
      this.props.is3DScene
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Tell React to never update this component, that's up to us
    return false;
  }

  render() {
   
    return (
      <Container ref="mapDiv" id={containerID}></Container>
    );
  }

  // ESRI JSAPI
  startup = (mapConfig, node, isScene = false) => {
    createView(mapConfig, node, isScene).then(
      response => {
        this.init(response);
        
        this.setupEventHandlers(this.map);
        this.setupWidgetsAndLayers();
        this.finishedLoading();
      },
      error => {
        console.error("maperr", error);
        window.setTimeout( () => {
          this.startup(mapConfig, node);
        }, 1000);
      })
  }

  finishedLoading = () => {
    // Update app state only after map and widgets are loaded
    this.props.onMapLoaded();
  }
  mapClicked = () =>{
    this.props.onMapClicked();
    console.log('map clicked')
  }
  init = (response) => {
    this.view = response.view
    this.map = response.view.map;
  }

  setupWidgetsAndLayers = () => {
    loadModules([
      'esri/layers/FeatureLayer',
      'esri/widgets/LayerList',
      'esri/core/Collection',
    ])
    .then( ([
      FeatureLayer,
      LayerList,
      Collection,
    ]) => {
      
      const featureLayer = new FeatureLayer({
        url: "https://dcdot.esriemcs.com/server/rest/services/Signs/SignWorks_Test/FeatureServer/0", outFields: ["*"]
      });
      this.map.add(featureLayer);

      // When the layer is loaded, query for the extent
      // of all features in the layer that satisfy the
      // definitionExpression. Then set the view's
      // extent to the returned extent of all features.

      this.view.on("click", this.mapClicked)
      featureLayer.when(function() {
        
        zoomToLayer(featureLayer);
      });

      


     

      // Appends a definitionExpression to a base expression
      // the base expression only returns freatures in
      // Canada, USA, and Mexico. It excludes some US territories
      // located on the other side of the dateline

   

      // Zooms to the extent of the layer as defined by
      // its definitionExpression
      // This method will work for all FeatureLayers, even
      // those without a saved `fullExtent` on the service.

      const zoomToLayer = (layer) => {
        return layer.queryExtent()
          .then((response) => {
            this.view.goTo(response.extent);
          });
      }
    });
  }

  setupEventHandlers = (map) => {
    loadModules([
      'esri/core/Collection'
    ], (
Collection
    ) => {

      //
      // JSAPI Map Event Handlers go here!
      //
     
    });
  }
}

const mapStateToProps = state => ({
  config: state.config,
  map: state.map
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (SceneViewExample);
