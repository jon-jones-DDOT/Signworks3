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
            paneSelection: 1,
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

    muttSelectorOpenHandler = () => {
        this.setState({paneSelection: 2, showInfo: false})
    }

    muttSelectorSaveHandler = () => {
        //

        this.setState({paneSelection: 1, showInfo: false, MUTCD: this.state.selMUTCD})
    }
    cancelMUTCDselectHandler = () => {

        this.setState({paneSelection: 1, showInfo: false})
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
        // console.log('from store', this.state.MUTCD)  console.log('from state',
        // this.state.selMUTCD)
        console.log('path in state', this.state.MUTCD.serverImagePath)

        const imgServerDown = window.location.origin + "/img/PR-OTHER.png"
        return (
            <div>
                <Img
                    src={[this.state.selMUTCD.serverImagePath, imgServerDown]}
                    className="SignEditorImage"
                    alt="sign"></Img>
                <div>{this.state.selMUTCD.code}
                    : {this.state.selMUTCD.name}</div>
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
        const imgServerDown = window.location.origin + "/img/PR-OTHER.png"
        return (

            <ModalWrapper
                {...this.props}
                title="Edit Support"
                width
                ={400}
                showOk={this.props.showOk}>

                <div
                    className={this.state.paneSelection === 1
                    ? "SignEditorOver"
                    : "SignEditorUnder"}>
                    <div
                        className="SignEditCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <div className="MUTCDdiv" onClick={this.muttSelectorOpenHandler}>
                       <Img
                            src={[this.state.MUTCD.serverImagePath, imgServerDown]}
                            className="SignEditorImage"
                            alt="sign"></Img>
                           
                        <span className="InnerMUTCD">
                            {this.state.MUTCD.code}:{this.state.MUTCD.name}
                        </span>

                    </div>
                    <div className="SignEditButtonDiv">
                        <button onClick={this.cancelClickHandler}>CANCEL</button>
                        <button onClick={this.saveClickHandler}>SAVE</button>
                    </div>

                </div>
                <div
                    className={this.state.paneSelection === 2
                    ? "SignEditorOver"
                    : "SignEditorUnder"}>
                    <div
                        className="SignEditCancel"
                        title="Close Window"
                        onClick={this.cancelMUTCDselectHandler}>X</div>
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

                    <button disabled={this.state.showInfo} onClick={this.cancelMUTCDselectHandler}>
                        CANCEL</button>
                    <div
                        className={this.state.showInfo
                        ? "MutcdInfoDiv"
                        : "MutcdInfoDiv_hidden"}>

                        {this.state.selMUTCD
                            ? this.readMUTCDinfo()
                            : null}
                        <button onClick={this.muttSelectorSaveHandler}>SELECT</button>

                    </div>
                </div>
            </ModalWrapper>
        )
    }
}
