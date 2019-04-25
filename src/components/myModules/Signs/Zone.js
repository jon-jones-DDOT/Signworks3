import React from 'react'
import {SignType, addOptionsToSelect} from '../../../SignworksJSON';
import './Zone.css'
import { zoneVerify } from './SignValidations';






export default function Zone(props) {
    const signTypes = new SignType();

    const zoneElementChangeHandler = (evt) =>{

     
      props.change(evt);
    }
const AMP = '&'

  return (
    <span>
                Zone:<select id="ward1" value={props.props.ward1} onChange={zoneElementChangeHandler}>
                {addOptionsToSelect(signTypes._codedValuesWards)}</select>
                <select id="anc1" value={props.props.anc1} onChange={zoneElementChangeHandler}>
                {addOptionsToSelect(signTypes._codedValuesAnc)}</select>
               {AMP}
                <select id='ward2' value={props.props.ward2} onChange= {zoneElementChangeHandler}>{addOptionsToSelect(signTypes._codedValuesWards)}</select>
                <select id="anc2" value={props.props.anc2} onChange={zoneElementChangeHandler}>{addOptionsToSelect(signTypes._codedValuesAnc)}</select>
            </span>
  )
}
