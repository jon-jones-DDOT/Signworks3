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
            schoolDayDisable: false,
            startDayDisable: false,
            endDayDisable: false,
            startTimeDisable: false,
            endTimeDisable: false,
            hourLimitDisable: false,
            errorMessage: ""
        }

    }
    componentDidMount() {
        console.log('this.state', this.state);
        console.log('this.props', this.props.value.attributes);
        const atts = this.props.value.attributes;

        if (atts.STARTDAY === 8) {
            this.setState({anyTimeDisable: true, schoolDayDisable: false})
        } else if (atts.STARTDAY === 9) {
            this.setState({anyTimeDisable: false, schoolDayDisable: true})
        }
    }

    timebandDisabler = (code) => {
        switch (code) {
            case "anytime":
                this.setState({startDayDisable: false, endDayDisable: true, startTimeDisable: true, endTimeDisable: true, hourLimitDisable: true});
                break;
            case "schooldays":
                this.setState({startDayDisable: false, endDayDisable: true, startTimeDisable: false, endTimeDisable: false, hourLimitDisable: false});
                break;
                case 'hours/limit':
                    this.setState({startTimeDisable: true, endTimeDisable: true, hourLimitDisable: true});
                    break;
            case 'none':
                this.setState({startDayDisable: false, endDayDisable: false, startTimeDisable: false, endTimeDisable: false, hourLimitDisable: false});
                break;
            default:
                break;

        }
    }

    timebandSelectChangeHandler = (evt, index) => {
        console.log('evt.currentTarget.selectedIndex', 'index', evt.currentTarget.selectedIndex, index)
        console.log('this.state change', this.state);
        console.log('this.props change', this.props.value.attributes);
        let value,
            atts;
        if (evt.currentTarget) {
            value = evt.currentTarget.selectedIndex;
            atts = this.props.value.attributes;
        }
        console.log('value , index:', value, index);
        if (index === 0) {
            //Start Day Check for ANYTIME
            if (value === 7) {
                console.log('validated anytime')
                this.timebandDisabler('anytime');
                this
                    .props
                    .change(evt, this.props.index, 5)
            } else if (value === 8) {
                this.timebandDisabler('schooldays');
                this
                    .props
                    .change(evt, this.props.index, 6)
            } 
            else if(value > atts.ENDDAY && atts.ENDDAY > 0){
                console.log('validated end>start')
                this.timebandDisabler('hours/limit');
                this.setState({errorMessage: "Start day is after end day", startDayErrorClass: 'timeband_err', endDayErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 0)
            }
                else {
                this.timebandDisabler('none');
                this.setState({errorMessage: "", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband'})
              
                this
                    .props
                    .change(evt, this.props.index, 0)
            }
        } else if (index === 1) {

            if (value < atts.STARTDAY) {
                this.timebandDisabler('hours/limit');
                this.setState({errorMessage: "Start day is after end day", startDayErrorClass: 'timeband_err', endDayErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 1)
            }
            else{
                this.timebandDisabler('none');
                this.setState({errorMessage: "", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband'})
              
                this
                .props
                .change(evt, this.props.index, 1)
            }

            
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
                    disabled = {this.state.startDayDisable}
                    value={this.props.value.attributes.STARTDAY
                    ? this.props.value.attributes.STARTDAY
                    : ""}
                    onChange={(evt) => this.timebandSelectChangeHandler(evt, 0)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandStartDays)}</select>
                <select
                    className={this.state.endDayErrorClass}
                    disabled={this.state.endDayDisable}
                    value={this.props.value.attributes.ENDDAY
                    ? this.props.value.attributes.ENDDAY
                    : ""}
                    onChange={(evt) => this.timebandSelectChangeHandler(evt, 1)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandEndDays)}</select>
                <select
                    className={this.state.startTimeErrorClass}
                    disabled={this.state.startTimeDisable}
                    value={this.props.value.attributes.STARTTIME
                    ? this.props.value.attributes.STARTTIME
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 2)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    className={this.state.endTimeErrorClass}
                    disabled={this.state.endTimeDisable}
                    value={this.props.value.attributes.ENDTIME
                    ? this.props.value.attributes.ENDTIME
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 3)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    className="timeband"
                    disabled={this.state.hourLimitDisable}
                    value={this.props.value.attributes.HOURLIMIT
                    ? this.props.value.attributes.HOURLIMIT
                    : ""}
                    onChange={(evt) => this.props.change(evt, this.props.index, 4)}>
                    {addOptionsToSelect(signTypes._codedValuesHourLimits)}</select>
            </div>
        )
    }
}
