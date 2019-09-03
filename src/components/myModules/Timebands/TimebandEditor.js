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

        const atts = this.props.value.attributes;

        if (atts.STARTDAY === 8) {

            this.timebandDisabler('anytime');

        } else if (atts.STARTDAY === 9) {
            this.timebandDisabler('schooldays');
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
                this.setState({startDayDisable: false, endDayDisable: false, startTimeDisable: true, endTimeDisable: true, hourLimitDisable: true});
                break;
            case 'days/limit':
                this.setState({startDayDisable: true, endDayDisable: true, hourLimitDisable: true})
            case 'none':
                this.setState({startDayDisable: false, endDayDisable: false, startTimeDisable: false, endTimeDisable: false, hourLimitDisable: false});
                break;
            default:
                break;

        }
    }

    timebandSelectChangeHandler = (evt, index) => {

        let value,
            atts;
        if (evt.currentTarget) {
            value = evt.currentTarget.selectedIndex;
            atts = this.props.value.attributes;
        }

        if (index === 0) {
            //Start Day Check for ANYTIME
            if (value === 7) {

                this.timebandDisabler('anytime');
                this.setState({errorMessage: "", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband', startTimeErrorClass: "timeband", endTimeErrorClass: 'timeband'})

                this
                    .props
                    .change(evt, this.props.index, 5);
                this
                    .props
                    .error('');
                return;
            } else if (value === 8) {
                this.timebandDisabler('schooldays');
                this.setState({errorMessage: "", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband', startTimeErrorClass: "timeband", endTimeErrorClass: 'timeband'})
                this
                    .props
                    .change(evt, this.props.index, 6);
                this
                    .props
                    .error('');
                return;
            } else if (value > atts.ENDDAY && atts.ENDDAY > 0) {

                this.timebandDisabler('hours/limit');
                this.setState({errorMessage: "Start day is after end day", startDayErrorClass: 'timeband_err', endDayErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 0, this.state.errorMessage);
                this
                    .props
                    .error("Start day is after end day")
                return;
            } else if (atts.ENDDAY === 0) {
                this.timebandDisabler('hours/limit');
                this.setState({errorMessage: "End day cannot be zero", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 0);
                this
                    .props
                    .error("End day cannot be zero");
                return;
            } else {
                this.timebandDisabler('none');
                this.setState({errorMessage: "", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband'})
                this
                    .props
                    .error("");
                this
                    .props
                    .change(evt, this.props.index, 0);
            }
        } else if (index === 1) {

            if (value < atts.STARTDAY) {
                this.timebandDisabler('hours/limit');
                this.setState({errorMessage: "Start day is after end day", startDayErrorClass: 'timeband_err', endDayErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 1, this.state.errorMessage);
                this
                    .props
                    .error("Start day is after end day");
                    return;
            } else {
                this.timebandDisabler('none');
                this.setState({errorMessage: "", startDayErrorClass: 'timeband', endDayErrorClass: 'timeband'})
                this
                    .props
                    .error('')
                this
                    .props
                    .change(evt, this.props.index, 1, this.state.errorMessage)
            }

        } else if (index === 2) {

            if (value > atts.ENDTIME && atts.ENDTIME > 0) {

                this.timebandDisabler('days/limit');
                this.setState({errorMessage: "Start time is after end time", startTimeErrorClass: 'timeband_err', endTimeErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 2);
                this
                    .props
                    .error("Start time is after end time");
            } else {
                //don't turn on endday if startday is Schooldays
                if (atts.STARTDAY === 8) {
                    this.timebandDisabler('schooldays');
                } else {
                    this.timebandDisabler('none');
                }

                this.setState({errorMessage: "", startTimeErrorClass: 'timeband', endTimeErrorClass: 'timeband'})

                this
                    .props
                    .change(evt, this.props.index, 2);
                this
                    .props
                    .error("");
            }
        } else if (index === 3) {
            if (value < atts.STARTTIME) {
                this.timebandDisabler('days/limit');
                this.setState({errorMessage: "Start day is after end day", startTimeErrorClass: 'timeband_err', endTimeErrorClass: 'timeband_err'})
                this
                    .props
                    .change(evt, this.props.index, 3, this.state.errorMessage);
                this
                    .props
                    .error("Start day is after end day");
            } else {
                this.timebandDisabler('none');
                this.setState({errorMessage: "", startTimeErrorClass: 'timeband', endTimeErrorClass: 'timeband'})

                this
                    .props
                    .change(evt, this.props.index, 3, this.state.errorMessage);
                this
                    .props
                    .error("");
            }
        } else if (index === 4) {
            // don't know any hourlimit validations at the moment
            this.props.error("");
        }

        if ((atts.ENDTIME === 0 || atts.STARTTIME === 0) && atts.STARTDAY < 7) {
      
            if (atts.STARTTIME === 0) {
                this.setState({errorMessage: "Start time is zero", startTimeErrorClass: 'timeband_err'});
                this.props.error("Start time cannot be zero");
            } else if (atts.ENDTIME === 0) {
                this.setState({errorMessage: 'End time is zero', endTimeErrorClass: "timeband_err"});
                this.props.error("End time cannot be zero");
            }
        }

        
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
                    disabled={this.state.startDayDisable}
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
                    onChange={(evt) => this.timebandSelectChangeHandler(evt, 2)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    className={this.state.endTimeErrorClass}
                    disabled={this.state.endTimeDisable}
                    value={this.props.value.attributes.ENDTIME
                    ? this.props.value.attributes.ENDTIME
                    : ""}
                    onChange={(evt) => this.timebandSelectChangeHandler(evt, 3)}>
                    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
                <select
                    className="timeband"
                    disabled={this.state.hourLimitDisable}
                    value={this.props.value.attributes.HOURLIMIT
                    ? this.props.value.attributes.HOURLIMIT
                    : ""}
                    onChange={(evt) => this.timebandSelectChangeHandler(evt, 4)}>
                    {addOptionsToSelect(signTypes._codedValuesHourLimits)}</select>
            </div>
        )
    }
}
