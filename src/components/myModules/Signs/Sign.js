import React from 'react'
import './Sign.css'

export default function Sign(props) {
   console.log("inside Sign Component", props.sign)
  return (
    <div className="Sign">
   {props.sign.feature.attributes.OBJECTID}
    
    </div>
  )
}
