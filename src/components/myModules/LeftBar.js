import React, {Component} from 'react'
import './LeftBar.css'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import StreetSmart from './StreetSmart';

 class LeftBar extends Component {

  

    render() {
        if(this.props.graphic.leftVisible){ return (
            <div className="LeftBar">
         
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
