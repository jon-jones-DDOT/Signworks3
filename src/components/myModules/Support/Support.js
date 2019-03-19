import React from 'react'
import "./Support.css"
import {SupportType} from '../../../SignworksJSON'
import {faBinoculars, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


export default function Support(props) {
    
    const SBT = new SupportType();
    let myImage = null;
    const getImage = () => {
        if (props.sel.selSupport) {

            if (props.sel.selSupport.attributes.SUPPORTTYPE) {
                myImage = window.location.origin + "/img/supports/" + props.sel.selSupport.attributes.SUPPORTTYPE + ".png"
            } else {
                myImage = window.location.origin + "/img/supports/666.png"
            }
        } else {
            myImage = window.location.origin + "/img/supports/666.png"
        }
        return myImage;
    }
    const supportInnards=()=>{
        if(props.sel === null){
            return 'no support found'
        }
        else if(props.sel.selSupport === null){
            return 'no support found...'
        }
        else{
            return (

                <div className="Support">
                   
                    <img src={getImage()} alt="support" className="SupportImage"/>
                    <p>
                        Sign Type: {props.sel
                            ? SBT.name(props.sel.selSupport.attributes.SUPPORTTYPE, "SUPPORTTYPE")
                            : 'null '}
                    </p>
                    <p>
                        Sign Status: {props.sel
                            ? SBT.name(props.sel.selSupport.attributes.SUPPORTSTATUS, "SUPPORTSTATUS")
                            : 'null '}
                    </p>
                    <p>
                        <button ><FontAwesomeIcon icon={faBinoculars} title="StreetSmart"/></button>
                        <button><FontAwesomeIcon icon={faGoogle} title="Google Street View"/></button>
                    
                        <button >
                            <FontAwesomeIcon icon={faUserEdit} title="Edit Support"/>
                        </button>
                    </p>
        
                </div>
            ) 
        }
    }

    return supportInnards(props)
}
