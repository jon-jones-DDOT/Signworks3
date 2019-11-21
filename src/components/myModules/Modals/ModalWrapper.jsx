import React from 'react'
import './ModalWrapper.css';
import {mapModes} from "../../../redux/reducers/graphic"

export default function ModalWrapper(props) {

    
 
  
   

    return (
        <div className={ props.graphic.mapClickMode=== mapModes.DRAW_MODE?"ModalWrapperHidden":"ModalWrapper" }>
          

            {props.children}

           
        </div>
    )
}
