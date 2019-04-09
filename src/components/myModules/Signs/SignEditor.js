import React, {Component} from 'react'
import {call} from 'redux-saga/effects';
import Img from 'react-image'
import './SignEditor.css'

import ModalWrapper from '../Modals/ModalWrapper';
import {SignType, addOptionsToSelect} from '../../../SignworksJSON';
import Timebands from './Timebands';
import Zone from './Zone';

let Typeahead = require('react-typeahead').Typeahead;

const myRef = React.createRef();
const amp = /[&]/;
export default class SignEditor extends Component {

    constructor(props) {
        super(props)
        console.log('props',)
        const zone = this.zoneParse(this.props.signs[this.props.editSignIndex].feature.attributes.ZONE_ID)
        this.state = {

            ...this.props.signs[this.props.editSignIndex],
            ...this.props.signs[this.props.editSignIndex].feature,
            paneSelection: 1,
            muttSelected: false,
            showInfo: false,
            selMUTCD: null,
            ward1: zone[0],
            anc1: zone[1],
            ward2: zone[2],
            anc2: zone[3]

        }

    }
    ZoneChangeHandler = (evt) => {

        switch (evt.target.id) {
            case "ward1":
                this.setState({ward1: evt.target.value});
                break;
            case "anc1":
                this.setState({anc1: evt.target.value});
                break;
            case "ward2":
                this.setState({ward2: evt.target.value});
                break;
            case "anc2":
                this.setState({anc2: evt.target.value});
                break;
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

    zoneParse = (zoneValue) => {
        // why don't we just set the controls directly?  Because they don't exist yet.
        // we don't have to check for all possible garbage because the zoneValue has
        // already passed ZoneVerify Don't run this without running and passing
        // zoneVerify first!
        let zoneArray = [];
        if (zoneValue) {
            // set first cell
            zoneArray[0] = zoneValue[0]
        } else {
            //empty zone id
            return "";
        }
        // set second cell
        if (!zoneValue[1]) {
            //just one ward no anc
            return zoneArray;
        } else if (amp.test(zoneValue[1])) {
            //second digit is amp so third must be ward
            zoneArray[2] = zoneValue[2];
            if (!zoneValue[3]) {
                // ward + amp + ward and done
                return zoneArray;
            } else {
                //ward + amp + ward + anc and done
                zoneArray[3] = zoneValue[3];
                return zoneArray;
            }
        } else {
            //ward + anc + ...
            zoneArray[1] = zoneValue[1];
            if (amp.test(zoneValue[2])) {
                zoneArray[2] = zoneValue[3];
                if (!zoneValue[4]) {
                    // ward + anc + amp + ward and done
                    return zoneArray;
                } else {
                    // ward + anc + amp + ward + anc
                    zoneArray[3] = zoneValue[4];
                    return zoneArray;
                }
            } else {
                // ward + anc and done
                return zoneArray;
            }
        }

    }

    signDirectionClickHandler = (evt) => {

        this.setState({paneSelection: 3})
        evt.stopPropagation()
    }

    signArrowSelectHandler = (evt) => {
        let id = Number(evt.target.id.charAt(4))
        this.setState({
            attributes: {
                ...this.state.attributes,
                'SIGNARROWDIRECTION': id
            },
            paneSelection: 1
        })

    }

    readMUTCDinfo = () => {
        // console.log('from store', this.state.MUTCD)  console.log('from state',
        // this.state.selMUTCD)
        console.log('path in state', this.state.MUTCD.serverImagePath)

        const imgServerDown = window.location.origin + "/img/PR-OTHER.png"
        return (
            <div>
                <img
                    src={this.state.selMUTCD.serverImagePath}
                    className="SignEditorImage"
                    alt="sign"></img>
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

    MPHSelectHandler = () => {}
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
                        <span>
                            <img
                                src={window.location.origin + "/img/" + this.state.attributes.SIGNARROWDIRECTION + ".png"}
                                onClick={this.signDirectionClickHandler}
                                className="SignDirectionArrow"></img>
                        </span>

                    </div>
                    <div className="SignAttributes">
                        <span>MPH:<select
                            value={this.state.attributes.SIGNNUMBER
                ? this.state.attributes.SIGNNUMBER
                : ""}
                            onChange={this.MPHSelectHandler}>{addOptionsToSelect(this.signTypes._codedValuesSpeedLimit)}</select>
                        </span>
                        <span className="ZoneSpan">
                            <Zone
                                props={{
                                ...this.state
                            }}
                                change={this.ZoneChangeHandler}></Zone>
                        </span>
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
                    <div className="SignEditButtonDiv">
                        <button onClick={this.cancelClickHandler}>CANCEL</button>
                        <button onClick={this.saveClickHandler}>SAVE</button>
                    </div>
                </div>
                <div
                    className={this.state.paneSelection === 3
                    ? "SignEditorOver"
                    : "SignEditorUnder"}>
                    <div
                        className="SignEditCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    SIGN ARROW DIRECTION SELECTOR TOOL™<table className="dirSignTable">
                        <tbody>
                            <tr>
                                <td><img
                                    src="img/6.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_6"/></td>
                                <td><img
                                    src="img/4.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_4"/></td>
                                <td><img
                                    src="img/8.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_8"/>
                                </td>
                            </tr>
                            <tr>
                                <td><img
                                    src="img/1.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_1"/></td>
                                <td><img
                                    src="img/3.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_3"/></td>
                                <td><img
                                    src="img/2.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_2"/>
                                </td>
                            </tr>
                            <tr>
                                <td><img
                                    src="img/7.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_7"/></td>
                                <td><img
                                    src="img/5.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_5"/></td>
                                <td><img
                                    src="img/9.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_9"/>
                                </td>
                            </tr>
                            <tr>
                                <td><img
                                    src="img/0.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_0"/></td>
                                <td>(no direction)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Click A Selection to Return To The Editor</p>
                </div>
            </ModalWrapper>
        )
    }
}
