import React from 'react'
import  './SupportEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';

export default function SupportEditor(props) {

  const saveClickHandler = () =>{
    props.modalClicked(false, null)
  }

  const cancelClickHandler = () =>{
    props.modalClicked(false, null)
  }
  return (
      <ModalWrapper
      {...props}
      title= "Edit Support"
      width ={400}
      showOk = {props.showOk} >
    <div className= "SupportEditor">
       <p> I am the Editor Pane. 
           </p>
           <p>{props.support.attributes.OBJECTID}</p>
           <button onClick = {cancelClickHandler}>CANCEL</button>
           <button onClick = {saveClickHandler}>SAVE</button>

    </div></ModalWrapper>
  )
}
