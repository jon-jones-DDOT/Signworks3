import React from 'react'
import Timeband from "./Timeband"
import TimebandEditor from './TimebandEditor'
import './Timebands.css'

export default function Timebands(props) {
  
    const makeBands = () => {
        if(props.edit){
            return props.bands.map((value, index) => (<TimebandEditor key={`item-${index}`} index={index} value={value} change={props.change}/>))
        }
        else{
            return props.bands.map((value, index) => (<Timeband key={`item-${index}`} index={index} value={value}/>))
        }
        
    }

    return (
        <div>
            Time Restrictions for this sign:
            <br/> 
            {props.bands.length > 0 ?makeBands():"No Restrictions"}

        </div>
    )
}
