import React from 'react'
import Img from 'react-image'
import './Sign.css'
import Timebands from '../Timebands/Timebands';

export default function Sign(props) {
    const imgErrorPath = props
        .sign
        .MUTCD
        .serverImagePath
        .substring(0, props.sign.MUTCD.serverImagePath.lastIndexOf("/")) + "/PR-OTHER.png";
    const imgServerDown = window.location.origin + "/img/PR-OTHER.png"    
 //console.log('img', imgErrorPath)
    return (
        <div className="Sign">
            <div className="SignMUTCDdiv">
                <Img
                    src={[props.sign.MUTCD.serverImagePath, imgErrorPath, imgServerDown]}
                    className="SignImage"
                    alt="sign"></Img>
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
           <Timebands bands = {props.sign.timebands}></Timebands>

        </div>
    )
}
