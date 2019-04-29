import React, {Component} from 'react'
import './SupportEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';
import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SupportEditor extends Component {

    constructor(props) {
        super(props)

        this.state = {

            ...this.props.support.attributes

        }
    }

    saveClickHandler = () => {
        this
            .props
            .modalClicked(false, null);

   let tempFeature = {...this.props.support};
   tempFeature.attributes = {...this.state};

        this
            .props
            .saveSupport(tempFeature, this.props.config.featureURLs);
        

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
                showOk={this.props.showOk}>
                   
                <div className="SupportEditor">
                <div
                        className="SignEditCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <p>{this.state.OBJECTID}</p>
                    <p>Support Type:<select value={this.state.SUPPORTTYPE} onChange={this.supportTypeChangeHandler}>{addOptionsToSelect(this.supportTypes._codedValuesSupportType)}</select>
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
