import React from 'react'
import "./Support.css"
import {SupportType} from '../../../SignworksJSON'
import {faBinoculars, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


export default function Support(props) {
    //console.log('props', props)
    const SBT = new SupportType();
    let myImage = null;
    const getImage = () => {
        if (props.sel) {

            if (props.sel.attributes.SUPPORTTYPE) {
                myImage = window.location.origin + "/img/supports/" + props.sel.attributes.SUPPORTTYPE + ".png"
            } else {
                myImage = window.location.origin + "/img/supports/666.png"
            }
        } else {
            myImage = window.location.origin + "/img/supports/666.png"
        }
        return myImage;
    }

    return (

        <div className="Support">

            <img src={getImage()} className="SupportImage"/>
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
            </p>
            <p>
                <button >
                    <FontAwesomeIcon icon={faUserEdit} title="Google Street View"/>
                </button>
            </p>

        </div>
    )
}
