import React from 'react'
import Img from 'react-image'
import './Sign.css'
import Timebands from '../Timebands/Timebands';
import {faUserEdit} from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function Sign(props) {
   
    const imgErrorPath = props
        .sign
        .MUTCD
        .serverImagePath
        .substring(0, props.sign.MUTCD.serverImagePath.lastIndexOf("/")) + "/PR-OTHER.png";
    const imgServerDown = window.location.origin + "/img/PR-OTHER.png"
    return (
        <div className="Sign">
            <div className="SignMUTCDdiv">
                <Img
                    src={[props.sign.MUTCD.serverImagePath, imgErrorPath, imgServerDown]}
                    className="SignImage"
                    alt="sign"
                    loader= {<Loader type="Puff"
                    color="#00BFFF"
                    height="100"	
                    width="100"/>}></Img>
                <div className="SignMutcdText">
                    {props.sign.feature.attributes.SIGNCODE}
                    <br></br>
                    {props.sign.MUTCD.name}
                </div>

                <Img
                    src={window.location.origin + "/img/" + props.sign.feature.attributes.SIGNARROWDIRECTION + ".png"}
                    className="SignArrowImage"/>
            </div>
            <hr/>
            <Timebands bands={props.sign.timebands} edit={false}></Timebands>
            <p>{props.sign.feature.attributes.OBJECTID}</p>
            <button onClick= {(evt) => props.editClick(evt, 'SIGN', props.index)} className="SignEditButton">
                <FontAwesomeIcon icon={faUserEdit} title="Edit Sign"/>
            </button>
        </div>
    )
}
