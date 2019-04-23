import React, {Component} from 'react'
import {SignType, addOptionsToSelect} from './../../../SignworksJSON'
import "./TimebandEditor.css"

const signTypes = new SignType();

export default class TimebandEditor extends Component {

    constructor(props)
    {
        super(props)
        this.state = {willDelete:false}
    }


    deleteBand = (evt, index) => {
      let newDel = !this.state.willDelete;
      this.setState({willDelete:newDel})
        this
            .props
            .delete(evt, index, this.state.willDelete)
    }

    render() {
        return (
            <div className={this.state.willDelete?"TimebandEditor_delete":"TimebandEditor"}>
                <button onClick= {(evt) => this.deleteBand(evt,this.props.index)}>
                    <b>X</b>
                </button>
                <select
                    value={this.props.value.attributes.STARTDAY
                    ? this.props.value.attributes.STARTDAY
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 0)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>
                <select
                    value={this.props.value.attributes.ENDDAY
                    ? this.props.value.attributes.ENDDAY
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 1)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>
                <select
                    value={this.props.value.attributes.STARTTIME
                    ? this.props.value.attributes.STARTTIME
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 2)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    value={this.props.value.attributes.ENDTIME
                    ? this.props.value.attributes.ENDTIME
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 3)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    value={this.props.value.attributes.HOURLIMIT
                    ? this.props.value.attributes.HOURLIMIT
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 4)}>
                    {addOptionsToSelect(signTypes._codedValuesHourLimits)}</select>
            </div>
        )
    }
}
