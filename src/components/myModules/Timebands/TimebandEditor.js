import React from 'react'
import {SignType, addOptionsToSelect} from './../../../SignworksJSON'

const signTypes = new SignType();

export default function TimebandEditor(props) {

  return (
    <div className="TimebandEditor">
   <button><b>X</b></button>
    <select value={props.value.attributes.STARTDAY?props.value.attributes.STARTDAY:""} 
    onChange={ (evt) => props.change(evt, props.index, 0)}>
    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>    
    <select value={props.value.attributes.ENDDAY?props.value.attributes.ENDDAY:""}  
    onChange={ (evt) => props.change(evt, props.index, 1)}>
    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>
    <select value={props.value.attributes.STARTTIME?props.value.attributes.STARTTIME:""}
     onChange={ (evt) => props.change(evt, props.index, 2)}>
    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
    <select value={props.value.attributes.ENDTIME?props.value.attributes.ENDTIME:""}
     onChange={ (evt) => props.change(evt, props.index, 3)}>
    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
    <select value={props.value.attributes.HOURLIMIT?props.value.attributes.HOURLIMIT:""}
    onChange={ (evt) => props.change(evt, props.index, 4)}>
    {addOptionsToSelect(signTypes._codedValuesHourLimits)}</select>
    </div>
  )
}
