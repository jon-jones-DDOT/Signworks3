import React from 'react'
import "./Support.css"
import {SupportType} from '../../../SignworksJSON'

export default function Support(props) {
  //console.log('props', props)
  const SBT = new SupportType();
 
 
  return (
    
    <div className="Support">
         <p>
        { props.sel?SBT.name(props.sel.attributes.SUPPORTTYPE, "SUPPORTTYPE"):'null '}
         </p>
    </div>
  )
}
