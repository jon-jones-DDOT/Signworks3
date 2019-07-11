import React, { Component } from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {mapModes, actions as graphicActions} from '../../redux/reducers/graphic';
import ReactStreetview from 'react-streetview'
import './GoogleMaps.css'

export  class GoogleMaps extends Component {
    ggCancel = () => {}
    render() {
       
              // see https://developers.google.com/maps/documentation/javascript
              const googleMapsApiKey = 'AIzaSyDXDefktZL_z_aT5bUbPA9V5HsPcegIIEI';
 console.log('props :', this.props.graphic.selSupportGeom);
              // see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanoramaOptions
              const streetViewPanoramaOptions = {
                  position: {lat: this.props.graphic.selSupportGeom.y, lng: this.props.graphic.selSupportGeom.x},
                  pov: {heading: 100, pitch: -5},
                  zoom: 1
              };
       
              return (
                  <div style={{
                      width: '100%',
                      height: '90%',
                      backgroundColor: '#eeeeee'
                  }}>
                      <div className="ggCancel" onClick={this.ggCancel}>X</div>
                      <ReactStreetview
                          apiKey={googleMapsApiKey}
                          streetViewPanoramaOptions={streetViewPanoramaOptions}
                      />
                  </div>
              );
    }
  }

  const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth:state.auth, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(GoogleMaps);