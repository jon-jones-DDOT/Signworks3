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
            searchText: ""
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

    addressSelectHandler = (evt) => {}

    optionMap = (value, index, srcOp) => {
        switch (srcOp) {
            case "DC Place":
                return (
                    <option key={`item-${index}`} index={index}>{value.ALIASNAME + " (" + value.WARD + ")"}</option>
                )
            case "DC Address":
                return (
                    <option key={`item-${index}`} index={index}>{value.FULLADDRESS + " (" + value.WARD + ")"}</option>
                )
            case "DC Intersection":
                return (
                    <option key={`item-${index}`} index={index}>{value.FULLINTERSECTION + " (" + value.WARD + ")"}</option>
                )
            case "DC Block Address":
                return (
                    <option key={`item-${index}`} index={index}>{value.BLOCKNAME + " (" + value.WARD + ")"}</option>
                )
        }

    }

    renderOptions = () => {
        const results = this.props.graphic.marResults;
        if (!results) {
            console.log('this.props.graphic.marFeatures :', this.props.graphic.marFeatures);
            return (
                <select multiple className="MARresults">
                    <option>
                        Results Appear Here</option >
                </select>
            )
        } else if (results.returnDataset) {
            return (
                <select multiple className="MARresults">
                    {this
                        .props
                        .graphic
                        .marResults
                        .returnDataset
                        .Table1
                        .map((value, index) => this.optionMap(value, index, results.sourceOperation))}
                </select>

            )
        }
        else  {
            console.log('this.props.graphic.marres :', this.props.graphic.marFeatures);
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