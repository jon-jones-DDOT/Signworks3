import React from 'react'
import './Timeband.css'
import {SignType} from './../../../SignworksJSON'

export default function Timeband(props) {
  let bob=  props.value.attributes.OBJECTID
 const domains  = new SignType();
  return (
    <span className= "TimebandRow">

    <span className="timebandElement">{domains.name(props.value.attributes.STARTDAY, "TIMEBAND_DAYS")}</span>
    <span className="timebandElement">{domains.name(props.value.attributes.ENDDAY, "TIMEBAND_DAYS")}</span>
    <span className="timebandElement">{domains.name(props.value.attributes.STARTTIME, "TIMEBAND_HOURS")}</span>
    <span className="timebandElement">{domains.name(props.value.attributes.ENDTIME, "TIMEBAND_HOURS")}</span>
    <span className="timebandElement">{domains.name(props.value.attributes.HOURLIMIT, "TIMEBAND_HOUR_LIMITS")}</span>
     
    </span>
  )
}