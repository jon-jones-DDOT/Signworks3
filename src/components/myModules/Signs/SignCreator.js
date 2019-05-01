import React from 'react'
import './SignCreator.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlusSquare} from '@fortawesome/free-solid-svg-icons';



export default function SignCreator(props) {
    console.log("props inside sign creator", props);
  return (
      props.sel?
    <div className="SignCreator">
     <button className= "SignAddButton" onClick={props.click} >
     <FontAwesomeIcon icon={faPlusSquare} title="Add Sign"/> ADD NEW SIGN
         </button>  
    </div>: 
    <div></div>
  )
}
