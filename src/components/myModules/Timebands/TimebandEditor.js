import React from 'react'
import {SignType, addOptionsToSelect} from './../../../SignworksJSON'

const signTypes = new SignType();

export default function Timeband(props) {
  console.log('props', props)
  return (
    <div>
   <button><b>X</b></button>
    <select value={props.value.attributes.STARTDAY} onChange={props.change}>
    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>    
    <select value={props.value.attributes.ENDDAY}>
    {addOptionsToSelect(signTypes._codedValuesTimebandDays)}</select>
    <select value={props.value.attributes.STARTTIME}>
    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
    <select value={props.value.attributes.ENDTIME}>
    {addOptionsToSelect(signTypes._codedValuesTimebandHours)}</select>
    <select value={props.value.attributes.HOURLIMIT}>
    {addOptionsToSelect(signTypes._codedValuesHourLimits)}</select>
    </div>
  )
}
