import React from 'react'
import './Timeband.css'

export default function Timeband(props) {
  let bob=  props.value.attributes.OBJECTID

  return (
    <span className= "TimebandRow">

    <span className="timebandElement">5 AM</span>
    <span className="timebandElement">5 AM</span>
    <span className="timebandElement">5 AM</span>
    <span className="timebandElement">5 AM</span>
    <span className="timebandElement">5 AM</span>
     
    </span>
  )
}
