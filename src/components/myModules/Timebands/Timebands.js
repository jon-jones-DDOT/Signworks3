import React from 'react'
import Timeband from "./Timeband"
import TimebandEditor from './TimebandEditor'
import './Timebands.css'

export default function Timebands(props) {

    const deleteBand = (evt, index) =>{
      
        props.delete(evt,index)
    }
    const makeBands = () => {
        if (props.edit) {
            return props
                .bands
                .map((value, index) => (<TimebandEditor
                    key={`item-${index}`}
                    index={index}
                    value={value}
                    change={props.change} delete = {deleteBand} signId = {props.signId}/>))
        } else {
            return props
                .bands
                .map((value, index) => (<Timeband key={`item-${index}`} index={index} value={value}/>))
        }

    }

    return (
        <div className="Timebands">
            Time Restrictions for this sign:
            <br/> {props.bands.length > 0
                ? makeBands()
                : "No Restrictions"}
            {props.edit
                ? <div className="addBandDiv">
                <button onClick={() => props.add(props.signId)} title= "Add Time Restriction"
                className="addBandButton">
                        <b>+</b>
                    </button></div>
                : ""}
        </div>
    )
}
