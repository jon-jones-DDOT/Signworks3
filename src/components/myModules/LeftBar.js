import React, {Component} from 'react'
import './LeftBar.css'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import StreetSmart from './StreetSmart';
import Script from 'react-load-script';
 class LeftBar extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        if(this.props.graphic.leftVisible){ return (
            <div className="LeftBar">
            <Script url="https://cdnjs.cloudflare.com/ajax/libs/ol3/4.1.0/ol.js"></Script>
    <Script url="https://streetsmart.cyclomedia.com/api/v19.40/StreetSmartApi.js"></Script>
            <StreetSmart></StreetSmart>
            </div>
        )}
        else{
            return null
        }
       
    }
}

const mapStateToProps = state => ({map: state.map, graphic: state.graphic, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftBar);
