import React from 'react'
import "./Support.css"
import {SupportType} from '../../../SignworksJSON'

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
                {props.sel
                    ? SBT.name(props.sel.attributes.SUPPORTTYPE, "SUPPORTTYPE")
                    : 'null '}
            </p>
        </div>
    )
}
