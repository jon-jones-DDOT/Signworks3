import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {mapModes, actions as graphicActions} from '../../redux/reducers/graphic';
import ReactStreetview from 'react-streetview'
import {layerURLs} from "../../utils/JSAPI"
import './GoogleMaps.css'

export class GoogleMaps extends Component {

    /*    constructor(props) {
        super(props);
        this.state = {
            x: null,
            y: null,
            spatialReference: {
                wkid: 4326
            },
            isWGS84: true,
            type: "point"
        };
    }  */

    pos = {
        x: null,
        y: null,
        spatialReference: {
            wkid: 4326
        },
        isWGS84: true,
        type: "point"
    }
    pov = null;

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
            const sel = {
                geometry: this.props.graphic.selSupportGeom
            }
            this
                .props
                .startGoogleStreetViewer(sel, layerURLs(this.props), 6);

        }
    }

    povChangeHandler = (pov) => {
   console.log('pov ', pov.heading, this.pos);
        this
            .props
            .getNewCone(this.pos, pov.pitch, pov.heading, layerURLs(this.props), "Google")
            this.pov = pov;
    }

    posChangeHandler = (pos) => {
        
console.log('position changed, state.pov, incoming pov', this.pov, this.props.graphic.initialBearing)
        this.pos.x = pos.lng();
        this.pos.y = pos.lat();
        let pov;
        if( this.pov === null){
            pov = this.props.graphic.initialBearing
        }
        else{
            pov = this.pov.heading;
        }
        this.props.getNewCone(this.pos, -5, pov,layerURLs(this.props), "Google")
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
                    streetViewPanoramaOptions={streetViewPanoramaOptions()}
                    onPositionChanged=
                    {(pos) => this.posChangeHandler(pos) }
                    onPovChanged=
                    {(pov) => this.povChangeHandler(pov)}/>

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