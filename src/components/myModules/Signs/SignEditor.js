import React, {Component} from 'react'
import './SignEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';
import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SignEditor extends Component {

    constructor(props) {
        super(props)
      console.log('state in SignEditor constructor', props)
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
                <div className="SignEditor">
                    <p>
                        I am the SIGN Editor Pane.
                    </p>
                    <p>{this.state.OBJECTID}</p>
                   

                    <button onClick={this.cancelClickHandler}>CANCEL</button>
                    <button onClick={this.saveClickHandler}>SAVE</button>

                </div>
            </ModalWrapper>
        )
    }
}
