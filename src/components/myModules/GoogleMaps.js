import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {mapModes, actions as graphicActions} from '../../redux/reducers/graphic';
import ReactStreetview from 'react-streetview'
import {layerURLs} from "../../utils/JSAPI"
import './GoogleMaps.css'

export class GoogleMaps extends Component {

    ggCancel = () => {

        this
            .props
            .closeStreetSmartViewer();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.graphic.selSupportGeom != nextProps.graphic.selSupportGeom) {
           
            return true;
        } else 
            return false;
        }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.graphic.selSupportGeom != this.props.graphic.selSupportGeom) {
            this
            .props
            .closeStreetSmartViewer();
            const sel = {geometry:this.props.graphic.selSupportGeom}
            this
            .props
            .startGoogleStreetViewer(sel, layerURLs(this.props), 6);
        
        }
    }

    render() {

        // see https://developers.google.com/maps/documentation/javascript
        const googleMapsApiKey = 'AIzaSyDXDefktZL_z_aT5bUbPA9V5HsPcegIIEI';

        // see
        // https://developers.google.com/maps/documentation/javascript/3.exp/reference#S
        // t reetViewPanoramaOptions
        const streetViewPanoramaOptions = () => {
            return ({

                position: {
                    lat: this.props.graphic.selSupportGeom.y,
                    lng: this.props.graphic.selSupportGeom.x
                },
                pov: {
                    heading: this.props.graphic.initialBearing,
                    pitch: -5
                },
                zoom: 2
            })
        }

        return (
            <div className="GoogleMaps">
                <div className="ggCancel" onClick={this.ggCancel}>X</div>
   
                <ReactStreetview
                    className="ggPane"
                    apiKey={googleMapsApiKey}
                    streetViewPanoramaOptions={streetViewPanoramaOptions()}/>

            </div>
        );
    }
}

const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth: state.auth, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(GoogleMaps);