import React, {Component} from 'react'
import {call} from 'redux-saga/effects';
import './SignEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';
import {SignType, addOptionsToSelect} from '../../../SignworksJSON';

let Typeahead = require('react-typeahead').Typeahead;

const myRef = React.createRef();
export default class SignEditor extends Component {

    constructor(props) {
        super(props)


        this.state = {

            ...this.props.signs[this.props.editSignIndex],
            muttActive: false,
            currentMUTCD: this.props.signs[this.props.editSignIndex].MUTCD

        }
     
    }

    saveClickHandler = () => {
        this
            .props
            .modalClicked(false, null);

        let tempFeature = {
            ...this.props.support
        };
        tempFeature.attributes = {
            ...this.state
        };

        this
            .props
            .saveSupport(tempFeature, this.props.config.featureURLs);

    }

    cancelClickHandler = () => {
        this
            .props
            .modalClicked(false, null)
    }

    muttSelectorHandler = () => {
        this.setState({
            muttActive: !this.state.muttActive
        })
    }
 cancelMUTCDselectHandler = () =>{
     this.setState({
        currentMUTCD: this.props.signs[this.props.editSignIndex].MUTCD
     })
     this.muttSelectorHandler()
 }
    mutcdLookUpSelectHandler = (desc) => {
        let option = desc.split(':')
      
        let chosenOne = this
            .props
            .map
            .muttArray
            .find(function (element) {
                return element.code === option[0]
            })
      
        this.setState({currentMUTCD: chosenOne})
        //this.muttSelectorHandler()
    }

    getOptions = () => {
        let bob = [];
        for (let i = 0; i < this.props.map.muttArray.length; i++) {
            bob.push(this.props.map.muttArray[i].code + ": " + this.props.map.muttArray[i].name)
        }
     
        return bob;

    }
    /*
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
*/

    signTypes = new SignType();

    render() {
      
        return (

            <ModalWrapper
                {...this.props}
                title="Edit Support"
                width
                ={400}
                showOk={this.props.showOk}>

                <div
                    className={this.state.muttActive
                    ? "SignEditorUnder"
                    : "SignEditorOver"}>

                    <p>{this.state.feature.attributes.OBJECTID}</p>
                    <p>{this.state.currentMUTCD.name}</p>
                    <button onClick={this.muttSelectorHandler}>MUTT</button>

                    <button onClick={this.cancelClickHandler}>CANCEL</button>
                    <button onClick={this.saveClickHandler}>SAVE</button>

                </div>
                <div
                    className={this.state.muttActive
                    ? "SignEditorOver"
                    : "SignEditorUnder"}>
                    <Typeahead
                        options={this.getOptions()}
                        maxVisible={5}
                        onOptionSelected={this.mutcdLookUpSelectHandler}
                        inputProps = {{'size':100}}
                        ref={myRef}/>

                    <p>MUTT SELECTOR</p>
                    <button onClick= {this.muttSelectorHandler}>SAVE</button>
                    <button onClick={this.cancelMUTCDselectHandler}>
                        CANCEL</button>
                </div>
            </ModalWrapper>
        )
    }
}
