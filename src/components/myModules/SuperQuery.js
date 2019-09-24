import React, {Component} from 'react'
import './SuperQuery.css'
import ModalWrapper from './Modals/ModalWrapper';
import {layerURLs} from '../../utils/JSAPI'
import Downshift from 'downshift'

//import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SuperQuery extends Component {

    constructor(props) {
        super(props)

        this.myRef = React.createRef();
        this.state = {
            selectedMutt: "",
            selectedSupportId: "",
            selectedSignId : "",
            selected: false,
            ready: true,
            tab1select: true,
            tab2select: false,
            tab3select: false
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
        let where = "SUPPORTSTATUS = 1 AND SIGNSTATUS = 1 AND ";
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
        return where;
    }

    searchClickHandler = (evt) => {
        let where = this.whereConcatHandler();

        this
            .props
            .removeQueryGraphics();

        console.log('where', where)
        const extent = this.props.map.extent;
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
        this.setState({selectedSupportId: evt.target.value.trim()})
    }

    signIdChangeHandler = (evt) =>{
        this.setState({selectedSignId:evt.target.value.trim()});
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
                            <label>SUPPORT ID</label>
                            <input
                                type="text"
                                className = "selectedSupportId"
                                value={this.state.selectedObjId}
                                onChange={this.supportIdChangeHandler}></input>
                        </div>
                        <div>
                            <label>SIGN ID</label>
                            <input
                                type="text"
                                className = "selectedSignId"
                                value={this.state.selectedSignId}
                                onChange={this.signIdChangeHandler}></input>
                        </div>
                    </div>
                    <div
                        className={this.state.tab3select
                        ? "queryTabContentSelected"
                        : "queryTabContent"}>I'm the third panel</div>
                    <div className="bottomDiv">
                        <div >
                            {this.props.graphic.queryCount}
                            &nbsp; features found</div>
                        <p>
                            The Extent for the query will be the extent of the displayed map</p>
                        < button ref={this.myRef} onClick={this.searchClickHandler} disabled={this.selected}>
                            SEARCH</button>
                    </div>

                </div>
            </ModalWrapper>
        )
    }
}
