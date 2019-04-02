import React from 'react'
import Img from 'react-image'
import "./Support.css"
import {SupportType} from '../../../SignworksJSON'
import {faBinoculars, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


export default function Support(props) {
    
    const SBT = new SupportType();
    
 

    
    const supportInnards=()=>{
        if(props.sel === null){
            return 'no support found'
        }
        else if(props.sel.selSupport === null){
            return 'no support found...'
        }
        else{
            const myImage = window.location.origin + "/img/supports/" + props.sel.attributes.SUPPORTTYPE + ".png";    
            const errImage = window.location.origin + "/img/supports/666.png";
          
            return (

                <div className="Support">
                   
                    <Img src={[myImage,errImage]} alt="support" className="SupportImage"/>
                    <p>
                        Sign Type: {props.sel
                            ? SBT.name(props.sel.attributes.SUPPORTTYPE, "SUPPORTTYPE")
                            : 'null '}
                    </p>
                    <p>
                        Sign Status: {props.sel
                            ? SBT.name(props.sel.attributes.SUPPORTSTATUS, "SUPPORTSTATUS")
                            : 'null '}
                    </p>
                    <p>
                        <button ><FontAwesomeIcon icon={faBinoculars} title="StreetSmart"/></button>
                        <button><FontAwesomeIcon icon={faGoogle} title="Google Street View"/></button>
                    
                        <button onClick = {(evt) => props.editClick(evt, 'SUPPORT')} >
                            <FontAwesomeIcon icon={faUserEdit} title="Edit Support"/>
                        </button>
                    </p>
        
                </div>
            ) 
        }
    }

    return supportInnards(props)
}
