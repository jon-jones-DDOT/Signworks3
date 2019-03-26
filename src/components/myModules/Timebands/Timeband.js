import React from 'react'

export default function Timeband(props) {
  let bob=  props.value.attributes.OBJECTID
  return (
    <div className= "TimebandRow">
    <select><option>5AM</option></select>
    <select><option>5AM</option></select>
    <select><option>5AM</option></select>
    <select><option>5AM</option></select>
    <select><option>5AM</option></select>
     
    </div>
  )
}
