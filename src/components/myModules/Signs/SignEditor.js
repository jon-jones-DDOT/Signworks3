import React, {Component} from 'react'
import {call} from 'redux-saga/effects';
import Img from 'react-image'
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
            muttSelected: false,
            showInfo: false,
            selMUTCD: null

        }

    }

    saveClickHandler = () => {
        //gotta implement, this one saves the sign/timebands to the server

    }

    cancelClickHandler = () => {
        //this cancels the editor window
        this
            .props
            .modalClicked(false, null)
    }

    muttSelectorHandler = () => {
        //just toggles between mutcd selector and sign editor

        this.setState({
            muttActive: !this.state.muttActive,
            showInfo: false
        })
    }
    cancelMUTCDselectHandler = () => {

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
        //myRef.current.focus();
        this.setState({showInfo: true, selMUTCD: chosenOne})
        //this.muttSelectorHandler()
    }

    cancelSelectionHandler = (evt) => {
        this.setState({showInfo: false})
    }

    getOptions = () => {
        let bob = [];
        for (let i = 0; i < this.props.map.muttArray.length; i++) {
            bob.push(this.props.map.muttArray[i].code + ": " + this.props.map.muttArray[i].name)
        }

        return bob;

    }
    readMUTCDinfo = () => {
       //console.log('from store', this.state.MUTCD)
      //  console.log('from state', this.state.selMUTCD)
      console.log('path in state', this.state.MUTCD.serverImagePath)

        const imgServerDown = window.location.origin + "/img/PR-OTHER.png"
        return (
            <div>
                <Img
                    src={[this.state.selMUTCD.serverImagePath, imgServerDown]}
                    className="SignImage"
                    alt="sign"></Img>
                    <div>{this.state.selMUTCD.code} : {this.state.selMUTCD.name}</div>
                    <div>Tags:{this.state.selMUTCD.tags}</div>

                <ul>
                    {this.state.selMUTCD.isParking
                        ? <li>Parking Sign</li>
                        : ""}
                    {this.state.selMUTCD.isSpeedLimit
                        ? <li>Speed Limit Sign</li>
                        : ""}
                    {this.state.selMUTCD.isNonstandard
                        ? <li>Non-Standard Sign</li>
                        : ""}
                    {this.state.selMUTCD.needsArrow
                        ? <li>Requires Direction Arrow</li>
                        : ""}
                    {this.state.selMUTCD.needsTimeband
                        ? <li>Requires Time Restriction</li>
                        : ""}

                </ul>

            </div>
        )
    }
    /*
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
                    <p>{this.state.MUTCD.name}</p>
                    <button onClick={this.muttSelectorHandler}>MUTT</button>

                    <button onClick={this.cancelClickHandler}>CANCEL</button>
                    <button onClick={this.saveClickHandler}>SAVE</button>

                </div>
                <div
                    className={this.state.muttActive
                    ? "SignEditorOver"
                    : "SignEditorUnder"}>
                    <div className="TypeAheadDiv">
                        <Typeahead
                            options={this.getOptions()}
                            maxVisible={10}
                            onOptionSelected={this.mutcdLookUpSelectHandler}
                            placeholder="TYPE DESCRIPTION"
                            disabled={this.state.showInfo}
                            inputProps={{
                            'size': 70
                        }}
                            ref={myRef}/>
                    </div>

                    <p>
                        "Enter Partial Description or MUTCD"</p>
                    <button onClick={this.muttSelectorHandler} disabled={this.state.showInfo}>SELECT</button>
                    <button disabled={this.state.showInfo} onClick={this.cancelMUTCDselectHandler}>
                        CANCEL</button>
                    <div
                        className={this.state.showInfo
                        ? "MutcdInfoDiv"
                        : "MutcdInfoDiv_hidden"}>

                        {this.state.selMUTCD
                            ? this.readMUTCDinfo()
                            : null}

                        <button onClick={this.cancelSelectionHandler}>CANCEL</button>
                    </div>
                </div>
            </ModalWrapper>
        )
    }
}
