import React from 'react'
import Timeband from "./Timeband"
import TimebandEditor from './TimebandEditor'
import './Timebands.css'

export default function Timebands(props) {

    const makeBands = () => {
        if (props.edit) {
            return props
                .bands
                .map((value, index) => (<TimebandEditor
                    key={`item-${index}`}
                    index={index}
                    value={value}
                    class="TimebandEditor"
                    change={props.change}
                    delete={props.delete}
                    error = {props.error}
                    signId={props.signId}/>))
        } else {
            return props
                .bands
                .map((value, index) => (<Timeband key={`item-${index}`} index={index} value={value}/>))
        }

    }

    return (
        <div >
            <div
                className={props.edit
                ? "TimebandTitle_Edit"
                : "TimebandTitle_View"}>
                
            </div><br></br>

            <div className= {props.edit?"Timebands_Edit":"Timebands_View"}>{props.bands.length > 0
                    ? makeBands()
                    : "No Restrictions"}
            </div>
            {props.edit
                ? <div className="addBandDiv">
                        <button
                            onClick={() => props.add(props.signId)}
                            title="Add Time Restriction"
                            className="addBandButton">
                            <b>+</b>
                        </button>
                    </div>
                : ""}
        </div>
    )
}
