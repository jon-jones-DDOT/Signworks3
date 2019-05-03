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

// React
import React, { Component } from 'react';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as mapActions } from '../redux/reducers/map';
import { actions as authActions } from '../redux/reducers/auth';


// Components


import TopNavList from 'calcite-react/TopNav/TopNavList';

import MapView from './esri/map/MapView';
import LoadScreen from './LoadScreen';


import RightBar from "./myModules/RightBar";

import Banner from './myModules/Banner';

// Styled Components
import styled from 'styled-components';
import ModalConductor from './myModules/Modals/ModalConductor';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const MapWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  position: relative;
  z-index: 0;
  

`;




const NavList = styled(TopNavList)`
  text-align: left;
`;

// Class
class Main extends Component {
  signIn = () => {
    this.props.checkAuth('https://www.arcgis.com');
  }

  signOut = () => {
    this.props.logout();
  }
 
  render() {
 
    return (
      <Container>
        <LoadScreen isLoading={this.props.mapLoaded} />

        <Banner {...this.props}></Banner>

        <MapWrapper>
          <MapView
          onMapClicked = {this.props.mapClicked}
            onMapLoaded={this.props.mapLoaded}
            mapConfig={this.props.config.mapConfig}
            onMapChanged = {this.props.mapChanged}
            is3DScene={false}
          />
           <RightBar/>
           <ModalConductor {...this.props.map}  />
        </MapWrapper>
       
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  map: state.map,
  auth: state.auth,
  config: state.config,
})

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions,
    ...authActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
