import React from 'react'
import './Timeband.css'
import {SignType} from './../../../SignworksJSON'

export default function Timeband(props) {
 
 const domains  = new SignType();
  return (
    <div className= "TimebandRow">
    
    
    <span className="timebandElement">{domains.name(props.value.attributes.STARTDAY, "TIMEBAND_START_DAYS")}
    {props.value.attributes.STARTDAY >7?"":  "-"}</span>
    <span className="timebandElement">{domains.name(props.value.attributes.ENDDAY, "TIMEBAND_END_DAYS")}
    {props.value.attributes.STARTDAY >7?"":  " | "}
    </span>
    <span className="timebandElement">{domains.name(props.value.attributes.STARTTIME, "TIMEBAND_HOURS")}
    {props.value.attributes.STARTDAY >7?"":  "M -"}</span>
    <span className="timebandElement">{domains.name(props.value.attributes.ENDTIME, "TIMEBAND_HOURS")}
    {props.value.attributes.STARTDAY >7?"":  "M "}
    </span>
    <span className="timebandElement">{domains.name(props.value.attributes.HOURLIMIT, "TIMEBAND_HOUR_LIMITS")}</span>
     
    </div>
  )
}
