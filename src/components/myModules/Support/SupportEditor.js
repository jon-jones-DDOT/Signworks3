import React from 'react'
import  './SupportEditor.css'

export default function SupportEditor(props) {
  return (
    <div className= "SupportEditor">
       <p> I am the Editor Pane.  Fear me.
           </p>
           <p>{props.support.attributes.OBJECTID}</p>

    </div>
  )
}
