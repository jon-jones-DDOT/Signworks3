import React from 'react'
import Timeband from "./Timeband"

export default function Timebands(props) {
    

  return (
    <div>
      
      {props.bands.map((value, index) => (<Timeband key={`item-${index}`} index={index} value={value}/>))}
    
    </div>
  )
}
