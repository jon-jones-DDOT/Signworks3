import React, {Component} from 'react'

import Img from 'react-image'
import './SignEditor.css'

import ModalWrapper from '../Modals/ModalWrapper';
import {SignType, addOptionsToSelect} from '../../../SignworksJSON';

import {muttGenerator, layerURLs} from "../../../utils/JSAPI";
import Downshift from 'downshift'
import Timebands from '../Timebands/Timebands';
import Zone from './Zone';
import {MutcdDuplicate, isSpeedLimit, zoneVerify, timebandVerify} from './SignValidations';

let Typeahead = require('react-typeahead').Typeahead;

const myRef = React.createRef();
const amp = /[&]/;

export default class SignEditor extends Component {

    constructor(props) {

        super(props)
        const zone = this.zoneParse(this.props.map.signs[this.props.map.editSignIndex].feature.attributes.ZONE_ID)
        this.state = {

            ...this.props.map.signs[this.props.map.editSignIndex],
            ...this.props.map.signs[this.props.map.editSignIndex].feature,
            paneSelection: 1,
            muttSelected: false,
            showInfo: false,
            muttInput: false,
            ward1: zone[0],
            anc1: zone[1],
            ward2: zone[2],
            anc2: zone[3],
            //validation keys
            muttDupe: false,
            zoneChecked: true
        }
        // the action property is just being arbitrarily tacked on here, I will use it
        // to sort the timebands for edits, adds, deletes, and no action
        for (let i = 0; i < this.state.timebands.length; i++) {
            this.state.timebands[i].action = 0;
        }
        this.items = this.formattedMuttArray();
    }

    zoneChangeHandler = (evt) => {
        let Checksky = true;
        switch (evt.target.id) {
            case "ward1":
                this.setState({
                    ward1: evt.target.value
                }, function () {
                    Checksky = zoneVerify(this.state)
                    this.setState({zoneChecked: Checksky})

                });
                break;
            case "anc1":
                this.setState({
                    anc1: evt.target.value
                }, function () {
                    Checksky = zoneVerify(this.state)
                    this.setState({zoneChecked: Checksky})

                });
                break;
            case "ward2":
                this.setState({
                    ward2: evt.target.value
                }, function () {
                    Checksky = zoneVerify(this.state)
                    this.setState({zoneChecked: Checksky})

                });
                break;
            case "anc2":
                this.setState({
                    anc2: evt.target.value
                }, function () {
                    Checksky = zoneVerify(this.state)
                    this.setState({zoneChecked: Checksky})

                });
                break;
            default:
                break;
        }

    }

    zoneAssembler = () => {

        // this.state.ward1 + this.state.anc1 + "&" + this.state.ward2 + this.state.anc2
        let zone = 'ndad';
        if (this.state.ward1) {

            zone = this
                .state
                .ward1
                .toString();

        } else {
            return ""
        }

        if (this.state.anc1) {

            zone += this
                .state
                .anc1
                .toString();

        }
        if (this.state.ward1 && this.state.ward2) {

            zone += "&" + this
                .state
                .ward2
                .toString();

        } else {
            return zone
        }
        if (this.state.ward2 && this.state.anc2) {

            return zone + this
                .state
                .anc2
                .toString();
        } else {
            return zone
        }
    }

    saveClickHandler = () => {

        const editedFeature = {};

        editedFeature.sign = {}
        editedFeature.sign.attributes = {
            ...this.state.attributes
        };
      /*  if (editedFeature.sign.attributes.SIGNARROWDIRECTION === 0) {
            editedFeature.sign.attributes.SIGNARROWDIRECTION = null;
        }  */

        editedFeature.sign.attributes.ZONE_ID = this.zoneAssembler();

        editedFeature.sign.attributes.SIGNCODE = this.state.MUTCD.code;
        editedFeature.editBands = [];
        editedFeature.newBands = [];
        editedFeature.deleteBands = [];

        for (let i = 0; i < this.state.timebands.length; i++) {

            switch (this.state.timebands[i].action) {
                case 1:
                    editedFeature
                        .newBands
                        .push(this.state.timebands[i]);
                    break;
                case 2:
                    editedFeature
                        .editBands
                        .push(this.state.timebands[i]);
                    break;
                case 3:
                    editedFeature
                        .deleteBands
                        .push(this.state.timebands[i].attributes.OBJECTID);
                    break;
                default:
                    break;
            }

        }
        const layers = layerURLs(this.props);

        this
            .props
            .saveSign(this.props.map.support, editedFeature, layers)
        this
            .props
            .modalClicked(false, null)
    }

    cancelClickHandler = () => {
        //this cancels the editor window
        this
            .props
            .modalClicked(false, null)
    }

    muttSelectorOpenHandler = (evt) => {
      
        this.setState({muttInput: true})
    }

    muttSelectorSaveHandler = () => {
        //
        const result = MutcdDuplicate(this.state.MUTCD.code, this.props.map.signs)

        this.setState({paneSelection: 1, muttDupe: result, showInfo: false})
    }

    mutcdLookUpSelectHandler = (desc) => {

        let option = desc
            .name
            .split(':')

        let chosenOne = this
            .props
            .map
            .muttArray
            .find(function (element) {
                return element.code.toLowerCase() === option[0].toLowerCase()
            })
           

        const mutt = muttGenerator(chosenOne).next();

        this.setState({MUTCD: mutt.value.payload.args[0][0], muttInput:false, showInfo: true})

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

    renderMuttInput = () => {
      
        return <span
            className={this.state.muttDupe
            ? "InnerMUTCD_error"
            : "InnerMUTCD"}>
            <div className="EditorMuttCode">
                {this
                    .state
                    .MUTCD
                    .name
                    .toUpperCase()}:
            </div>
            <div className="EditorMuteDesc">
                {this.state.MUTCD.name}
            </div>

        </span>

    }

    renderMuttDownshift = () => {
        return <Downshift
            onChange=
            {(sel) => this.mutcdLookUpSelectHandler(sel)}
            itemToString={item => (item
            ? item.name
            : '')}>
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem
            }) => (
                <div>

                    <input {...getInputProps(this.inputProps)}/>
                    <ul {...getMenuProps(this.menuProps)}>

                        {isOpen
                            ? this
                                .items
                                .filter(item => !inputValue || item.name.includes(inputValue.toUpperCase()))
                                .map((item, index) => (
                                    <li
                                        {...getItemProps({ key: item.id, index, item, style: { backgroundColor: highlightedIndex === index ? 'lightgray' : 'white', fontWeight: selectedItem === item ? 'bold' : 'normal', }, })}>
                                        {item.name}
                                    </li>
                                ))
                            : null}
                    </ul>
                </div>
            )}
        </Downshift>
    }

    readMUTCDinfo = () => {

        return (
            <div>
                <img
                    src={this.state.MUTCD.serverImagePath}
                    className="SignEditorImage"
                    alt="sign"></img>
                <div>{this.state.MUTCD.code}
                    : {this.state.MUTCD.name}</div>
                <div>Tags:{this.state.MUTCD.tags}</div>

                <ul>
                    {this.state.MUTCD.isParking
                        ? <li>Parking Sign</li>
                        : ""}
                    {this.state.MUTCD.isSpeedLimit
                        ? <li>Speed Limit Sign</li>
                        : ""}
                    {this.state.MUTCD.isNonstandard
                        ? <li>Non-Standard Sign</li>
                        : ""}
                    {this.state.MUTCD.needsArrow
                        ? <li>Requires Direction Arrow</li>
                        : ""}
                    {this.state.MUTCD.needsTimeband
                        ? <li>Requires Time Restriction</li>
                        : ""}

                </ul>

            </div>
        )
    }

    MPHSelectHandler = (evt) => {

        this.setState({
            attributes: {
                ...this.state.attributes,
                'SIGNNUMBER': Number(evt.target.value)
            }
        });
    }

    statusChangeHandler = (evt) => {

        this.setState({
            attributes: {
                ...this.state.attributes,
                "SIGNSTATUS": Number(evt.target.value)
            }
        })
    }

    signTextChangeHandler = (evt) => {
        this.setState({
            attributes: {
                ...this.state.attributes,
                "SIGNTEXT": evt.target.value
            }
        })
    }

    //Timeband Handlers

    timebandChangeHandler = (evt, index, ctrl) => {

        let bands = [...this.state.timebands]

        switch (ctrl) {

            case 0:
                bands[index].attributes.STARTDAY = Number(evt.target.value);
                break;
            case 1:
                bands[index].attributes.ENDDAY = Number(evt.target.value);
                break;
            case 2:
                bands[index].attributes.STARTTIME = Number(evt.target.value);
                break;
            case 3:
                bands[index].attributes.ENDTIME = Number(evt.target.value);
                break;
            case 4:
                bands[index].attributes.HOURLIMIT = Number(evt.target.value);
                break;
            default:
                break;
        }

        timebandVerify(bands[index])

        // set action to edit if existing record, unedited or already scheduled for
        // editing records marked for add or delete will retain their current action
        if (bands[index].action === 0 || bands[index].action === 2) {

            bands[index].action = 2;
        }

        this.setState({
            timebands: [...bands]
        })
    }

    timebandAddHandler = (signId) => {

        let bands = [...this.state.timebands]
        const newBand = {
            attributes: {
                CREATED_DATE: null,
                CREATED_USER: null,
                ENDDAY: 0,
                ENDTIME: 0,
                EXCEPTION: null,
                GLOBALID: null,
                HOURLIMIT: 0,
                LAST_EDITED_DATE: null,
                LAST_EDITED_USER: null,
                LINKID: null,
                OBJECTID: null,
                ORIGIN_ID: null,
                RESTRICTIONORDER: null,
                RESTRICTIONSTATUS: null,
                SIGNID: signId,
                SPACEARROW: null,
                SPACEID: null,
                STARTDAY: 8,
                STARTTIME: 0
            },
            action: 1
        }

        bands.push(newBand);
        this.setState({
            timebands: [...bands]
        })
    }

    timebandDeleteHandler = (evt, index, del) => {

        let bands = [...this.state.timebands]
        // if it is an existing record , edited or not, mark for deletion
        if (bands[index].action === 0 || bands[index].action === 2) {
            bands[index].action = 3 // if it is a new record, set to zero and it will disappear on save

        } else {
            bands[index].action = 0
        }

        this.setState({
            timebands: [...bands]
        })
    }

    signTypes = new SignType();
    items = [];
    inputProps = {
        size: 40,
        autoFocus: true
    };
    menuProps = {
        style: {
            listStyle: 'none'
        }
    };

    formattedMuttArray = () => {

        let mutt = [];
        for (let i = 0; i < this.props.map.muttArray.length; i++) {
            let leMutt = {};
            leMutt.name = this
                .props
                .map
                .muttArray[i]
                .code
                .toUpperCase() + ":" + this
                .props
                .map
                .muttArray[i]
                .name
                .toUpperCase();
            leMutt.id = this.props.map.muttArray[i].id;
            mutt.push(leMutt);

        }
        return mutt;
    }

    render() {
        const imgServerDown = window.location.origin + window.location.pathname + "/img/PR-OTHER.png"
        return (

            <ModalWrapper
                {...this.props}
                title="Edit Sign"
                width
                ={400}
                showOk={this.props.map.showOk}>

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
                        {this.state.muttInput
                            ? this.renderMuttDownshift()
                            : this.renderMuttInput()}
                        <span>
                             <Img
                                alt="sign direction"
                                src={[this.state.attributes.SIGNARROWDIRECTION?
                                     window.location.origin + window.location.pathname + "/img/" + this.state.attributes.SIGNARROWDIRECTION + ".png":
                                window.location.origin + window.location.pathname + "/img/0.png"
                            ]}
                                onClick={this.signDirectionClickHandler}
                                className="SignDirectionArrow"></Img>
                        </span>

                    </div>
                    <div>
                        <hr className="EditorHorizontalBar"/>
                    </div>

                    <div className="SignAttributes">
                        <span>MPH:
                            <select
                                value={this.state.attributes.SIGNNUMBER
                                ? this.state.attributes.SIGNNUMBER
                                : ""}
                                disabled={isSpeedLimit(this.state.attributes.SIGNCODE)}
                                onChange={this.MPHSelectHandler}>{addOptionsToSelect(this.signTypes._codedValuesSpeedLimit)}
                            </select>
                        </span>
                        <span
                            className={this.state.zoneChecked
                            ? "ZoneSpan"
                            : "ZoneSpan_error"}>
                            <Zone
                                props={{
                                ...this.state
                            }}
                                change={this.zoneChangeHandler}></Zone>
                        </span>
                        <div className="StatusDiv">
                            <span >
                                Status:
                                <select
                                    className="StatusSelect"
                                    value={this.state.attributes.SIGNSTATUS}
                                    onChange={this.statusChangeHandler}>
                                    {addOptionsToSelect(this.signTypes._codedValuesSignStatus)}</select>

                            </span>
                            <span className="SignTextSpan">
                                Sign Text:
                                <textarea
                                    value={this.state.attributes.SIGNTEXT === null
                                    ? ""
                                    : this.state.attributes.SIGNTEXT}
                                    onChange={this.signTextChangeHandler}
                                    rows="4"
                                    className="SignText"></textarea>
                            </span>

                        </div>
                        <div className="TimebandDiv">
                            <Timebands
                                bands={this.state.timebands}
                                edit={true}
                                change={this.timebandChangeHandler}
                                add={this.timebandAddHandler}
                                delete={this.timebandDeleteHandler}
                                signId={this.state.feature.attributes.GLOBALID}></Timebands>
                        </div>
                        <div className="SignEditButtonDiv">
                            <button onClick={this.saveClickHandler}>SAVE</button>
                            <button onClick={this.cancelClickHandler}>CANCEL
                            </button>
                        </div>
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
                                    alt="6"
                                    src="img/6.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_6"/></td>
                                <td><img
                                    alt="4"
                                    src="img/4.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_4"/></td>
                                <td><img
                                    alt="8"
                                    src="img/8.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_8"/>
                                </td>
                            </tr>
                            <tr>
                                <td><img
                                    alt="1"
                                    src="img/1.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_1"/></td>
                                <td><img
                                    alt="3"
                                    src="img/3.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_3"/></td>
                                <td><img
                                    alt="2"
                                    src="img/2.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_2"/>
                                </td>
                            </tr>
                            <tr>
                                <td><img
                                    alt="7"
                                    src="img/7.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_7"/></td>
                                <td><img
                                    alt="5"
                                    src="img/5.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_5"/></td>
                                <td><img
                                    alt="9"
                                    src="img/9.png"
                                    className="dirSign"
                                    onClick={this.signArrowSelectHandler}
                                    id="dir_9"/>
                                </td>
                            </tr>
                            <tr>
                                <td><img
                                    alt="0"
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
