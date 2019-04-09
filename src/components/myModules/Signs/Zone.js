import React from 'react'
import {SignType, addOptionsToSelect} from '../../../SignworksJSON';
import './Zone.css'






export default function Zone(props) {
    const signTypes = new SignType();
console.log('props', props)
  return (
    <span>
                Zone:<select id="ward1" value={props.props.ward1} onChange={props.change}>
                {addOptionsToSelect(signTypes._codedValuesWards)}</select>
                <select id="anc1" value={props.props.anc1} onChange={props.change}>
                {addOptionsToSelect(signTypes._codedValuesAnc)}</select>
                <select id='ward2' value={props.props.ward2} onChange= {props.change}>{addOptionsToSelect(signTypes._codedValuesWards)}</select>
                <select id="anc2" value={props.props.anc2} onChange={props.change}>{addOptionsToSelect(signTypes._codedValuesAnc)}</select>
            </span>
  )
}
