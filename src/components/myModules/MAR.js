import React, { Component } from 'react'
import ModalWrapper from './Modals/ModalWrapper';
import "./MAR.css"

export default class MAR extends Component {
    addressSearch = (evt) =>{
        if(evt.which ===13){

        }

    }
    
    render() {
        return (
           <ModalWrapper{...this.props}
           title="MAR Query"
           width
           ={400}
           showOk={this.props.map.showOk}>
<div className="MAR">
   <p>  TYPE AN ADDRESS AND PRESS ENTER</p>
   <input onKeyPress={this.addressSearch}></input>

</div>
           </ModalWrapper>
        )
    }
}
