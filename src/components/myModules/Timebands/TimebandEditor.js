import React, {Component} from 'react'
import {SignType, addOptionsToSelect} from './../../../SignworksJSON'
import "./TimebandEditor.css"

const signTypes = new SignType();

export default class TimebandEditor extends Component {

    constructor(props)
    {
        super(props)
        this.state = {
            willDelete: false,
            startDayErrorClass: "timeband",
            endDayErrorClass: "timeband",
            startTimeErrorClass: "timeband",
            endTimeErrorClass: "timeband",
            anyTimeDisable: false,
            schoolDayDisable:false
        }

    }
    componentDidMount() {
        console.log('this.state', this.state);
        console.log('this.props', this.props.value.attributes);
        const atts = this.props.value.attributes;

        if (atts.STARTDAY === 8){
            this.setState({anyTimeDisable:true})
        }
    }
 

    timebandSelectChangeHandler = (evt, index) => {
        console.log('evt.currentTarget.selectedIndex', 'index', evt.currentTarget.selectedIndex, index)
        let value;
        if (evt.currentTarget){
            value = evt.currentTarget.selectedIndex;
        }

        if (index === 0) {
            //Start Day Check for ANYTIME
            if (value === 8) {
                this.setState({anyTimeDisable: true, schoolDayDisable:false});
                this.props.change(evt, this.props.index, 5)
            }
            else if(value === 9){
                this.setState({anyTimeDisable:false, schoolDayDisable:true})
                this.props.change(evt, this.props.index, 6)
            }
            else{
                this.setState({anyTimeDisable:false, schoolDayDisable:false})
                this.props.change(evt,this.props.index,0)
            }
        }
        else if (index === 1){
            console.log('value', value)
        }

     //     this.props.change(evt, this.props.index, 0)
    }

    deleteBand = (evt, index) => {
        let newDel = !this.state.willDelete;
        this.setState({willDelete: newDel})
        this
            .props
            .delete(evt, index, this.state.willDelete)
    }

    render() {
        return (
            <div
                className={this.state.willDelete
                ? "TimebandEditor_delete"
                : "TimebandEditor"}>
                <button onClick= {(evt) => this.deleteBand(evt,this.props.index)}>
                    <b>X</b>
                </button>
                <select
                    className={this.state.startDayErrorClass}
                    value={this.props.value.attributes.STARTDAY
                    ? this.props.value.attributes.STARTDAY
                    : ""}
                    onChange={(evt) => this.timebandSelectChangeHandler(evt, 0)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>
                <select
                    className={this.state.endDayErrorClass}
                    disabled = { this.state.anyTimeDisable || this.state.schoolDayDisable}
                    value={this.props.value.attributes.ENDDAY
                    ? this.props.value.attributes.ENDDAY
                    : ""}
                    onChange={(evt) =>this.timebandSelectChangeHandler(evt, 1)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>
                <select
                    className={this.state.startTimeErrorClass}
                    disabled = { this.state.anyTimeDisable}
                    value={this.props.value.attributes.STARTTIME
                    ? this.props.value.attributes.STARTTIME
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 2)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    className={this.state.endTimeErrorClass}
                    disabled = { this.state.anyTimeDisable}
                    value={this.props.value.attributes.ENDTIME
                    ? this.props.value.attributes.ENDTIME
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 3)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    className="timeband"
                    disabled = { this.state.anyTimeDisable}
                    value={this.props.value.attributes.HOURLIMIT
                    ? this.props.value.attributes.HOURLIMIT
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 4)}>
                    {addOptionsToSelect(signTypes._codedValuesHourLimits)}</select>
            </div>
        )
    }
}
