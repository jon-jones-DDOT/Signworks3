import React, {Component} from 'react'
import './SupportEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';
import { layerURLs} from "../../../utils/JSAPI";
import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SupportEditor extends Component {

    constructor(props) {
        super(props)

        this.state = {

            ...this.props.map.support.attributes

        }

    }

    saveClickHandler = () => {
        this
            .props
            .modalClicked(false, null);

   let tempFeature = {...this.props.map.support};
   tempFeature.attributes = {...this.state};

   tempFeature.attributes.SIGNWORKS_LAST_EDITED_BY = this.props.auth.user.username;
   

        this
            .props
            .saveSupport(tempFeature, layerURLs(this.props));
        

    }

    cancelClickHandler = () => {
        this
            .props
            .modalClicked(false, null)
    }

    supportTypeChangeHandler = (evt) => {
        this.setState({
            "SUPPORTTYPE": Number(evt.target.value)
        })
    }

    supportStatusChangeHandler = (evt) => {
       
        this.setState({
            "SUPPORTSTATUS": Number(evt.target.value)
        })
    }

    supportTypes = new SupportType();

    render() {

        return (

            <ModalWrapper
                {...this.props}
                title="Edit Support"
                width
                ={400}
                showOk={this.props.map.showOk}>
                   
                <div className="SupportEditor">
                <div
                        className="SignEditCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <p> ID: {this.state.GLOBALID}</p>
                    
                    <p>Support Type:<select value={this.state.SUPPORTTYPE} onChange={this.supportTypeChangeHandler}>
                    {addOptionsToSelect(this.supportTypes._codedValuesSupportType)}</select>
                    </p>
                    <p>Support Status:
                        <select
                            value={this.state.SUPPORTSTATUS}
                            onChange={this.supportStatusChangeHandler}>{addOptionsToSelect(this.supportTypes._codedValuesSupportStatus)}</select>
                    </p>

                    <button onClick={this.cancelClickHandler}>CANCEL</button>
                    <button onClick={this.saveClickHandler}>SAVE</button>

                </div>
            </ModalWrapper>
        )
    }
}
