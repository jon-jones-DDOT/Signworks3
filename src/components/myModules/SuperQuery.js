import React, {Component} from 'react'
import './SuperQuery.css'
import ModalWrapper from './Modals/ModalWrapper';
import {layerURLs} from '../../utils/JSAPI';
import Downshift from 'downshift';
import {SupportType, SignType, addOptionsToSelect} from '../../SignworksJSON';
import {mapModes} from "../../redux/reducers/graphic"
import {faDrawPolygon} from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

//import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SuperQuery extends Component {

    constructor(props) {
        super(props)

        this.myRef = React.createRef();
        this.yourRef = React.createRef();
        this.state = {
            selectedMutt: "",
            selectedSupportId: "",
            selectedSignId: "",
            selectedSupportType: 0,
            selectedSupportStatus: 1,
            selectedSignStatus: 1,
            selectedMph: "",
            selectedSubblockKey: "",
            selected: false,
            ready: true,
            hidden: false,
            tab1select: true,
            tab2select: false,
            tab3select: false,
            selectedExtent: 1,
            customExtent: null
        }
        //  this.items = this.getOptions();
        this.items = this.formattedMuttArray();
        this
            .props
            .removeQueryGraphics();
    }

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

    supportTypes = new SupportType();
    signTypes = new SignType();

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

    mutcdLookUpSelectHandler = (desc) => {

        let option = desc
            .name
            .split(':')
        this.setState({selectedMutt: option[0], selected: true})
        this
            .myRef
            .current
            .focus();

    }

    cancelClickHandler = () => {

        this
            .props
            .modalClicked(false, null)
    }

    whereConcatHandler = () => {
        let complex = false;
        let where = "";
        if (this.state.selectedMutt) {
            where = "SIGNCODE='" + this.state.selectedMutt + "'";
            complex = true;
        }
        if (this.state.selectedSupportId) {
            where += (complex
                ? ' AND '
                : "") + " SUPPORTID='" + this.state.selectedSupportId + "'";
            complex = true;
        }
        if (this.state.selectedSignId) {
            where += (complex
                ? ' AND '
                : "") + " SIGNID='" + this.state.selectedSignId + "'";
            complex = true;
        }
        if (this.state.selectedSupportType > 0) {
            where += (complex
                ? ' AND '
                : "") + " SUPPORTTYPE=" + this.state.selectedSupportType;
            complex = true;
        }
        if (this.state.selectedSupportStatus > -1) {
            where += (complex
                ? ' AND '
                : "") + " SUPPORTSTATUS=" + this.state.selectedSupportStatus;
            complex = true;
        }
        if (this.state.selectedSignStatus > -1) {
            where += (complex
                ? ' AND '
                : "") + " SIGNSTATUS=" + this.state.selectedSignStatus;
            complex = true;
        }
        if (this.state.selectedMph > 0) {
            where += (complex
                ? ' AND '
                : "") + " SIGNNUMBER='" + this.state.selectedMph + "'";
            complex = true;
        }
        if (this.state.selectedSubblockKey) {
            where += (complex
                ? ' AND '
                : "") + " SUBBLOCKKEY='" + this.state.selectedSubblockKey + "'";
            complex = true;
        }

        return where;
    }

    searchClickHandler = (evt) => {
        let where = this.whereConcatHandler();

        this
            .props
            .removeQueryGraphics();

        let extent = null;
        if (this.state.selectedExtent === 1) {
            extent = this.props.map.extent;
        } else if (this.state.selectedExtent === 2) {
            extent = null;
        } else if (this.state.selectedExtent === 3) {
            if (this.props.graphic.queryCustExt) {
                extent = this.props.graphic.queryCustExt;
            } else {
                alert('No custom extent was drawn.')
            }
        } else {
            alert('you have no extent selected, somehow')
        }
        const layer = layerURLs(this.props).superquery;

        this
            .props
            .querySuperQuery(where, extent, layer)

    }

    tabSelectHandler = (tab) => {
        if (tab == 1) {
            this.setState({tab1select: true, tab2select: false, tab3select: false})

        } else if (tab == 2) {
            this.setState({tab1select: false, tab2select: true, tab3select: false})
        } else {
            this.setState({tab1select: false, tab2select: false, tab3select: true})
        }

    }

    supportIdChangeHandler = (evt) => {
        this.setState({
            selectedSupportId: evt
                .target
                .value
                .trim()
        })
    }

    signIdChangeHandler = (evt) => {
        this.setState({
            selectedSignId: evt
                .target
                .value
                .trim()
        });
    }

    supportTypeChangeHandler = (evt) => {
        this.setState({
            selectedSupportType: Number(evt.target.value)
        })
    }

    supportStatusChangeHandler = (evt) => {
        this.setState({
            selectedSupportStatus: Number(evt.target.value)
        })
    }

    mphChangeHandler = (evt) => {
        this.setState({
            selectedMph: Number(evt.target.value)
        })
    }

    signStatusChangeHandler = (evt) => {
        this.setState({
            selectedSignStatus: Number(evt.target.value)
        })
    }

    subblockKeyChangeHandler = (evt) => {
        this.setState({
            selectedSubblockKey: evt
                .target
                .value
                .trim()
        })
    }

    clearAttribHandler = () => {
        this.setState({
            selectedSupportId: "",
            selectedSignId: "",
            selectedSupportType: 0,
            selectedSupportStatus: 1,
            selectedSignStatus: 1,
            selectedMph: "",
            selectedSubblockKey: "",
            selected: false,
            ready: true
        })
    }

    extentChangeHandler = (evt) => {
 
        this.setState({
            selectedExtent: Number(evt.target.value)
        })
    }

    drawButtonClickHandler = (evt) => {
     this.yourRef.current.checked = true;
     let fakeEvent = {target:{value:3}}
     this.extentChangeHandler(fakeEvent);
        this
            .props
            .setMapClickMode(mapModes.DRAW_MODE, 'default')
    }

    render() {

        return (

            <ModalWrapper
                {...this.props}
                title="Query"
                width
                ={400}
                showOk={this.props.showOk}>

                <div className="SuperQuery">
                    <div
                        className="SuperQueryCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <div className="queryTabRow">
                        <div
                            className={this.state.tab1select
                            ? "queryTabSelect"
                            : "queryTab"}
                            onClick={() => this.tabSelectHandler(1)}>MUTCD</div>
                        <div
                            className={this.state.tab2select
                            ? "queryTabSelect"
                            : "queryTab"}
                            onClick={() => this.tabSelectHandler(2)}>ATTRIBUTES</div>
                        <div
                            className={this.state.tab3select
                            ? "queryTabSelect"
                            : "queryTab"}
                            onClick={() => this.tabSelectHandler(3)}>EXTENT</div>
                    </div>
                    <div
                        className={this.state.tab1select
                        ? "queryTabContentSelected"
                        : "queryTabContent"}>

                        <p>Type a partial MUTCD and select from results</p>
                        <Downshift
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
                                                        {...getItemProps({ key: item.id, index, item, style: { backgroundColor: highlightedIndex === index ? 'lightgray' : 'white', fontWeight: selectedItem === item ? 'bold' : 'normal', } })}>
                                                        {item.name}
                                                    </li>
                                                ))
                                            : null}
                                    </ul>
                                </div>
                            )}
                        </Downshift>

                    </div>

                    <div
                        className={this.state.tab2select
                        ? "queryTabContentSelected"
                        : "queryTabContent"}>
                        <div>
                            <label>MUTCD:</label>
                            <input
                                type="text"
                                disabled
                                value={this.state.selectedMutt}
                                className="selectedMUTCD"></input>
                        </div>

                        <div>
                            <label>MPH:</label>
                            <select
                                className="selectedMPH"
                                value={this.state.selectedMph}
                                onChange={this.mphChangeHandler}>{addOptionsToSelect(this.signTypes._codedValuesSpeedLimit)}
                            </select>
                        </div>
                        <div>
                            <label>SUBBLOCK KEY:</label>
                            <input
                                type="text"
                                className="selectedSubblockKey"
                                value={this.state.selectedSubblockKey}
                                onChange={this.subblockKeyChangeHandler}></input>
                        </div>
                        <hr></hr>
                        <div>
                            <label>SUPPORT STATUS:</label>
                            <select
                                className="selectedSupportStatus"
                                value={this.state.selectedSupportStatus}
                                onChange={this.supportStatusChangeHandler}>{addOptionsToSelect(this.supportTypes._codedValuesSupportStatus)}</select>
                        </div>
                        <div>
                            <label>SUPPORT TYPE:</label>
                            <select
                                className="selectedSupportType"
                                value={this.state.selectedSupportType}
                                onChange={this.supportTypeChangeHandler}>
                                {addOptionsToSelect(this.supportTypes._codedValuesSupportType0)}</select>
                        </div>

                        <div>
                            <label>SUPPORT ID:</label>
                            <input
                                type="text"
                                className="selectedSupportId"
                                value={this.state.selectedSupportId}
                                onChange={this.supportIdChangeHandler}></input>
                        </div>
                        <hr></hr>
                        <div>
                            <label>SIGN STATUS:</label>
                            <select
                                className="selectedSignStatus"
                                value={this.state.selectedSignStatus}
                                onChange={this.signStatusChangeHandler}>
                                {addOptionsToSelect(this.signTypes._codedValuesSignStatus)}</select>
                        </div>
                        <div>
                            <label>SIGN ID:</label>
                            <input
                                type="text"
                                className="selectedSignId"
                                value={this.state.selectedSignId}
                                onChange={this.signIdChangeHandler}></input>
                        </div>
                    </div>
                    <div
                        className={this.state.tab3select
                        ? "queryTabContentSelected"
                        : "queryTabContent"}>
                        <div className="queryRadioDiv">
                            <input
                                type='radio'
                                name="extent"
                                value="1"
                                defaultChecked
                                className="queryRadioButton"
                                onChange={this.extentChangeHandler}></input>
                                <div className="extentTextDiv">
                                     Map Extent - Will search the general area shown on the map.
                                </div>
                           
                        </div>
                        <hr></hr>
                        <div className="queryRadioDiv">
                            <input
                                type='radio'
                                name="extent"
                                value="2"
                                className="queryRadioButton"
                                onChange={this.extentChangeHandler}></input>
                                <div className="extentTextDiv">
                                City Extent - Will search the entire area of the District. Primarily for use
                            with IDs, using this option for a MUTCD may result in queries that are too big
                            to be useful.
                                </div>
                           
                        </div>
                        <hr></hr>
                        <div className="queryRadioDiv">
                            <input
                                type='radio'
                                name="extent"
                                value="3"
                                ref={this.yourRef}
                                className="queryRadioButton"
                                onClick={this.extentChangeHandler}></input>
                            <div className="extentTextDiv">
                                Custom Extent - Use the Draw Tool to make a search extent.
                            </div>
                            <button className="drawButton" onClick={this.drawButtonClickHandler} disabled = {this.state.selectedExtent!=3}>
                                <FontAwesomeIcon icon={faDrawPolygon} title="Edit Sign"/></button>
                        </div>

                    </div>
                    <div className="bottomDiv">
                        <div >
                         <p> {this.props.graphic.queryCount===0?"Press SEARCH to query map":this.props.graphic.queryCount + " features found"  }
                             </p>  
                           </div>
                       
                        <button onClick={this.clearAttribHandler} disabled={!this.state.tab2select}>CLEAR</button>
                        < button ref={this.myRef} onClick={this.searchClickHandler} disabled={this.selected}>
                            SEARCH</button>
                    </div>

                </div>
            </ModalWrapper>
        )
    }
}
