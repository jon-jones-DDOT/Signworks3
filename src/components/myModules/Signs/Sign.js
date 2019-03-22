import React from 'react'
import './Sign.css'

export default function Sign(props) {
  
  return (
    <div className="Sign">
      I'm a sign {props.feature.attributes.OBJECTID}
      <p> Sign Order {props.feature.attributes.SIGNORDER } </p>
    </div>
  )
}
