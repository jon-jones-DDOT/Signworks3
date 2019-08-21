import React, {Component} from 'react'
import styled from 'styled-components';
import Support from './Support/Support'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import {layerURLs} from "../../utils/JSAPI"
import {leftKeys} from '../../SignworksJSON'
import Signs from './Signs/Signs';
import SignCreator from './Signs/SignCreator';
import "./RightBar.css"
import {layer} from '@fortawesome/fontawesome-svg-core';

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
        let key;


        if(this.props.graphic.leftKey === leftKeys.SS_VIEW_FIRST ){
            key = leftKeys.SS_VIEW_REPEAT;
        }
        else {
            key = leftKeys.SS_VIEW_FIRST;
        }

   
        this
            .props
            .startStreetSmartViewer([sel], layerURLs(this.props), 4326, 2248, this.props.graphic.viewWidth, this.props.graphic.viewExtentWidth, this.props.graphic.view_spatRef, false, key, this.props.map.retiredPosts)
    }

    googleStreetsClickHandler = (evt, sel) => {

        let key;       

        if(this.props.graphic.leftKey === leftKeys.GOOGLE_FIRST || this.props.graphic.leftKey === leftKeys.GOOGLE_REPEAT){
            key = leftKeys.GOOGLE_REPEAT;
        }
        else {
            key = leftKeys.GOOGLE_FIRST;
        }
       
        const point = {
            type: "point", // autocasts as new Point()
            x: sel.geometry.x,
            y: sel.geometry.y,
            spatialReference: {
                wkid: 4326
            }
        }
        if(key === leftKeys.GOOGLE_REPEAT){
            this
            .props
            .closeStreetSmartViewer();
        }
        this
            .props
            .startGoogleStreetViewer(sel, layerURLs(this.props), key);
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
                "SUPPORTID": this.props.map.support.attributes.GLOBALID,
                "SIGNWORKS_CREATED_BY": this.props.auth.user.username,
                "SIGNWORKS_LAST_EDITED_BY":this.props.auth.user.username

            }
        }

        //save new sign
        this
            .props
            .newSign(this.props.map.support, signWrapper, layerURLs(this.props))

    }

    toggleShowRetiredSignsHandler = (evt) => {
        this
            .props
            .showRetiredSigns(evt.currentTarget.checked)
    }

    render() {

        return (

            <RightDiv className="RightBar">

                <Support
                    sel={this.props.map.support}
                    editClick={this.handleModalClicked}
                    SsClick={this.streetSmartClickHandler}
                    GsClick={this.googleStreetsClickHandler}
                    retCheck={this.toggleShowRetiredSignsHandler}
                    canEdit={this.props.auth.isEditor}
                    showRet={this.props.map.retiredSigns}></Support>
                <Signs
                    signs={this.props.map.signs}
                    editClick={this.handleModalClicked}
                    canEdit={this.props.auth.isEditor}></Signs>
                {this.props.auth.isEditor
                    ? <SignCreator sel={this.props.map.support} click={this.addSignHandler}></SignCreator>
                    : null}

            </RightDiv>
        )
    }
}

const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth: state.auth, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RightBar);
