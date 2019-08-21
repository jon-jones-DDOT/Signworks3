import React from 'react'
import Img from 'react-image'
import './Sign.css'
import Timebands from '../Timebands/Timebands';
import {faUserEdit} from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function Sign(props) {
console.log('props.sign.timebands', props.sign.timebands)
    const imgErrorPath = props
        .sign
        .MUTCD
        .serverImagePath
        .substring(0, props.sign.MUTCD.serverImagePath.lastIndexOf("/")) + "/PR-OTHER.png";
    const imgServerDown = window.location.origin+ window.location.pathname  + "/img/PR-OTHER.png";

const getSignClass= () =>{

    if (props.sign.feature.attributes.SIGNSTATUS === 1){
        return "Sign"
    }
    else if(props.sign.feature.attributes.SIGNSTATUS === 5 && props.showRetired){
        return "SignRetired_Visible"
    }
    else{
        return 'SignRetired_Hidden'
    }
}

const getZone = ()=>{
    const zone = props.sign.feature.attributes.ZONE_ID;
    if (zone == 0 || !zone){
        return;
    }
    else if(zone.includes('&')){
        return "Zones " + zone
    }
    else{
        return "Zone " + zone
    }
}
    
    return (
        <div className={getSignClass()}>
            <div className="SignMUTCDdiv">
                <Img
                    src={[props.sign.MUTCD.serverImagePath, imgErrorPath, imgServerDown]}
                    className="SignImage"
                    alt="sign"
                    loader=
                    {<Loader type="Puff" color="#00BFFF" height="100" width="100"/>}></Img>
                <div className="SignMutcdText">
                    {props.sign.feature.attributes.SIGNCODE}
                    <br></br>
                    <div className="SignMUTCDdesc">{props.sign.MUTCD.name}
                    </div>
                </div>

                <Img
                    src={props.sign.feature.attributes.SIGNARROWDIRECTION != 0?
                        window.location.origin + window.location.pathname + "/img/" + props.sign.feature.attributes.SIGNARROWDIRECTION + ".png":null}
                    className="SignArrowImage"/>
            </div>
            <hr/>
            <div className="SignZoneDiv">{ getZone() }</div>
            <div>{props.canEdit? <button
                    onClick=
                    {(evt) => props.editClick(evt, 'SIGN', props.index)}
                    className="SignEditButton">
                    <FontAwesomeIcon icon={faUserEdit} title="Edit Sign"/>
                </button>:null}
           
                <Timebands bands={props.sign.timebands} edit={false}></Timebands>

                
            </div>

        </div>
    )
}
