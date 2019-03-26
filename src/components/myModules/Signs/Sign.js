import React from 'react'
import Img from 'react-image'
import './Sign.css'

export default function Sign(props) {
 const imgErrorPath = props.sign.MUTCD.serverImagePath.substring(0,props.sign.MUTCD.serverImagePath.lastIndexOf("/")) + "/PR-OTHER.png";
    
    return (
        <div className="Sign">
            <Img
                src={[props.sign.MUTCD.serverImagePath,imgErrorPath]}
                className="SignImage"
                alt="sign"
                ></Img>

            <p>{props.sign.feature.attributes.OBJECTID}</p>
            <p>{props.sign.feature.attributes.SIGNCODE}
            </p>

        </div>
    )
}
