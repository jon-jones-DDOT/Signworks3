import React, {Component} from 'react'
import './SupportEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';
import { layerURLs} from "../../../utils/JSAPI";
import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SupportEditor extends Component {

    constructor(props) {
        super(props)
console.log('this.prop.map.support :', this.props.map.support);
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
        console.log('evt.target.value :', evt.target.value);
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
                    <p>{this.state.OBJECTID}</p>
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
