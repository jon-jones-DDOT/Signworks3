import React, {Component} from 'react'
import './SuperQuery.css'
import ModalWrapper from './Modals/ModalWrapper';
//import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SuperQuery extends Component {

    constructor(props) {
        super(props)

       
    }

   

    render() {

        return (

            <ModalWrapper
                {...this.props}
                title="Query"
                width
                ={400}
                showOk={this.props.showOk}>
                   
                <div className="SuperQuery">
               
DUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUDE
                </div>
            </ModalWrapper>
        )
    }
}
