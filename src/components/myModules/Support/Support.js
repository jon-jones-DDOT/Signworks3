import React from 'react'
import Img from 'react-image'
import "./Support.css"
import {SupportType} from '../../../SignworksJSON'
import {faBinoculars, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function Support(props) {

    const SBT = new SupportType();


    const supportInnards = () => {

        if (props.sel === null) {
            return 'Click on a support on the map to see its information'
        } else if (props.sel.selSupport === null) {
            return 'no support found...'
        } else {
       
            const myImage = window.location.origin + window.location.pathname + "/img/supports/" + props.sel.attributes.SUPPORTTYPE + ".png";

            const errImage = window.location.origin + window.location.pathname + "/img/supports/666.png";

            return (

                <div className={props.leftOpen?"Support_comp":"Support"}>

                    <Img src={[myImage, errImage]} alt="support" className={props.leftOpen?"SupportImage_comp":"SupportImage"}/>
                    <p>
                        Sign Type: {props.sel
                            ? SBT.name(props.sel.attributes.SUPPORTTYPE, "SUPPORTTYPE")
                            : 'null '}
                    </p>

                    <p>
                        <button onClick={(evt) => props.SsClick(evt, props.sel)} className="supportButton"><FontAwesomeIcon icon={faBinoculars} title="StreetSmart"/></button>
                        <button onClick={(evt) => props.GsClick(evt, props.sel)}className="supportButton"><FontAwesomeIcon icon={faGoogle} title="Google Street View"/></button>
                        {props.canEdit
                            ? <button onClick= {(evt) => props.editClick(evt, 'SUPPORT')}className="supportButton">
                                    <FontAwesomeIcon icon={faUserEdit} title="Edit Support"/>
                                </button>
                            : null}

                    </p>
                    <div>
                    <label className={props.leftOpen?"showRetired_comp":"showRetired"}><input type= "checkbox" checked={props.showRet} onChange={(evt) =>props.retCheck(evt)} ></input> Show Retired Signs</label>    
                    </div>
                </div>
            )
        }
    }

    return supportInnards(props)
}
