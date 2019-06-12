import React, {Component} from 'react'
import styled from 'styled-components';
import Support from './Support/Support'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import {layerURLs} from "../../utils/JSAPI"
import Signs from './Signs/Signs';
import SignCreator from './Signs/SignCreator';
import "./RightBar.css"

const RightDiv = styled.div ` 


 width:30%;
 
`
class RightBar extends Component {

    handleModalClicked = (evt, type, index) => {

        this
            .props
            .modalClicked(true, type, index)
    }

    streetSmartClickHandler = (evt, sel) => {
     
        this.props.startStreetSmartViewer([sel],layerURLs(this.props),4326,2248,
             this.props.graphic.viewWidth, this.props.graphic.viewExtentWidth, this.props.graphic.view_spatRef, false)
    }

    addSignHandler = (evt) => {

        // this may look dumb, but we are sharing a function with saveSign and the input
        // parameter must match structure
        let signWrapper = {};

        signWrapper.sign = {
            "attributes": {
                "SIGNCODE": "new addition",
                "SIGNSIZE": null,
                "SIGNTEXT": null,
                "MUTCD": null,
                "SIGNFACING": null,
                "SIGNNUMBER": null,
                "SIGNARROWDIRECTION": null,
                "ORIGIN_ID": null,
                "MANUAL_SEGID": null,
                "SIGNORDER": null,
                "SIGNSTATUS": 1,
                "ZONE_ID": null,
                "SUPPORTID": this.props.map.support.attributes.GLOBALID
            }
        }

        //save new sign
        this
            .props
            .newSign(this.props.map.support, signWrapper, layerURLs(this.props))

    }

    render() {

        return (

            <RightDiv className="RightBar">

                <Support
                    sel={this.props.map.support}
                    editClick={this.handleModalClicked}
                    SsClick={this.streetSmartClickHandler}></Support>
                <Signs signs={this.props.map.signs} editClick={this.handleModalClicked}></Signs>
                <SignCreator sel={this.props.map.support} click={this.addSignHandler}></SignCreator>
            </RightDiv>
        )
    }
}

const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth:state.auth,  config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RightBar);
