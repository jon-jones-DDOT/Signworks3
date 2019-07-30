import React, {Component} from 'react'
import ModalWrapper from './Modals/ModalWrapper';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {mapModes, actions as graphicActions} from '../../redux/reducers/graphic';
import "./MAR.css"

export class MAR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            selectedOpt: null
        }
    }

    addressSearch = (evt) => {
        if (evt.which === 13) {

            this
                .props
                .queryMAR(this.state.searchText)
        }

    }

    textChange = (evt) => {
        this.setState({searchText: evt.target.value});

    }

    cancelClickHandler = (evt) => {
        this
            .props
            .modalClicked(false, null)
    }

    funTricks = () => {
        let fish = "tuna";
        let fish2 = fish;
        console.log(fish, fish2);
        fish = "trout";
        console.log(fish, fish2);
    }

    addressSelectHandler = (evt) => {
        this.funTricks();
        console.log('event :', evt.target.value);
        const selectedOption = this.props.graphic.marResults.returnDataset.Table1[evt.target.value];
        console.log('selectedOption', selectedOption)
        this.setState({selectedOpt: selectedOption})
    }
    GoToPointonMapButtonHandler = (evt) => {
        console.log('evt', this.state.selectedOpt)
        const point = {
            type: "point", // autocasts as new Point()
            x: this.state.selectedOpt.LONGITUDE,
            y: this.state.selectedOpt.LATITUDE,
            spatialReference: {
                wkid: 4326
            }
        }

        this
            .props
            .zoomToSelectedPoint(point);
    }

    optionMap = (value, index, srcOp) => {

        switch (srcOp) {
            case "DC Place":
                return (
                    <option key={`item-${index}`} index={index} value={index}>{value.ALIASNAME + " (" + value.WARD + ")"}</option>
                )
            case "DC Address":
                return (
                    <option key={`item-${index}`} index={index} value={index}>{value.FULLADDRESS + " (" + value.WARD + ")"}</option>
                )
            case "DC Intersection":
                return (
                    <option key={`item-${index}`} index={index} value={index}>{value.FULLINTERSECTION + " (" + value.WARD + ")"}</option>
                )
            case "DC Block Address":
                return (
                    <option key={`item-${index}`} index={index} value={index}>{value.BLOCKNAME + " (" + value.WARD + ")"}</option>
                )
        }

    }

    renderDetails = (opt) => {

        if (!opt) {
            return;
        } else {
            return (
                <div className="MARresultsDetails">
                    {opt.ALIASNAME
                        ? <p>ALIAS: {opt.ALIASNAME}</p>
                        : null}
                    {opt.FULLADDRESS
                        ? <p>ADDRESS:{opt.FULLADDRESS}</p>
                        : null}
                    {opt.SMD
                        ? <p>SMD:{opt.SMD}</p>
                        : null}
                    {opt.ANC
                        ? <p>ANC: {opt.ANC}
                            </p>
                        : null}
                    {opt.WARD
                        ? <p>WARD:{opt.WARD}</p>
                        : null}
                    {opt.VOTE_PRCNCT
                        ? <p>VOTER PRECINCT:{opt.VOTE_PRCNCT}</p>
                        : null}
                    <button onClick={this.GoToPointonMapButtonHandler}>Go To This Location</button>

                </div>
            )
        }
    }

    renderOptions = () => {
        const results = this.props.graphic.marResults;
        if (!results) {

            return (
                <select multiple className="MARresults">
                    <option>
                        Results Appear Here</option >
                </select>
            )
        } else if (results.returnDataset) {
            return (
                <select multiple className="MARresults" onChange={this.addressSelectHandler}>
                    {this
                        .props
                        .graphic
                        .marResults
                        .returnDataset
                        .Table1
                        .map((value, index) => this.optionMap(value, index, results.sourceOperation))}
                </select>

            )
        } else {

            return (
                <select multiple className="MARresults">
                    <option>
                        No Results Returned</option >
                </select>
            )
        }

    }

    render() {
        return (
            <ModalWrapper{...this.props}
                title="MAR Query"
                width
                ={400}
                showOk={this.props.map.showOk}>

                <div className="MAR">
                    <div
                        className="MARCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <p>
                        TYPE AN ADDRESS AND PRESS ENTER</p>
                    <input
                        onKeyPress={this.addressSearch}
                        className="MARsearch"
                        onChange={this.textChange}
                        value={this.state.searchText}></input>

                    {this.props.graphic.returnDataset
                        ? this.renderOptions()
                        : this.renderOptions()}
                    <div >{this.renderDetails(this.state.selectedOpt)}</div>
                </div>
            </ModalWrapper>
        )
    }
}
const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth: state.auth, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MAR);