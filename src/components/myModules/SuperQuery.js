import React, {Component} from 'react'
import './SuperQuery.css'
import ModalWrapper from './Modals/ModalWrapper';
let Typeahead = require('react-typeahead').Typeahead;
//import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SuperQuery extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedMutt: null
        }

    }

    getOptions = () => {
        let bob = [];
        for (let i = 0; i < this.props.map.muttArray.length; i++) {
            bob.push(this.props.map.muttArray[i].code + ": " + this.props.map.muttArray[i].name)
        }

        return bob;

    }

    mutcdLookUpSelectHandler = (desc) => {

        let option = desc.split(':')
        this.setState({selectedMutt: option[0]})

    }

    cancelClickHandler = () => {

        this
            .props
            .modalClicked(false, null)
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
                    <div
                        className="SuperQueryCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <div>

                        <p>Type a partial MUTCD and select from results</p>

                        <Typeahead
                            options={this.getOptions()}
                            maxVisible={10}
                            onOptionSelected={this.mutcdLookUpSelectHandler}
                            placeholder="TYPE DESCRIPTION"
                            inputProps={{
                            'size': 70
                        }}/>
                    </div>

                    <p>
                        The Extent for the query will be the current extent of the displayed map</p>
                    < button>DO THIS THING</button>

                </div>
            </ModalWrapper>
        )
    }
}
