import React from 'react'
import Timeband from "./Timeband"
import './Timebands.css'

export default function Timebands(props) {

    const makeBands = () => {
        return props.bands.map((value, index) => (<Timeband key={`item-${index}`} index={index} value={value}/>))
    }

    return (
        <div>
            Time Restrictions for this sign:
            <br/> 
            {props.bands.length > 0 ?makeBands():"No Restrictions"}

        </div>
    )
}
