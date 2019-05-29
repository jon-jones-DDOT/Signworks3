import React, {Component} from 'react'
import './SuperQuery.css'
import ModalWrapper from './Modals/ModalWrapper';

let Typeahead = require('react-typeahead').Typeahead;

//import {SupportType, addOptionsToSelect} from '../../../SignworksJSON';

export default class SuperQuery extends Component {

    constructor(props) {
        super(props)
        this.myRef = React.createRef();
        this.state = {
            selectedMutt: null,
            selected: false,
            ready: true
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
        this.setState({selectedMutt: option[0], selected: true})
        this
            .myRef
            .current
            .focus();

    }

    cancelClickHandler = () => {

        this
            .props
            .modalClicked(false, null)
    }

    searchClickHandler = (evt) => {
        // when this finally breaks , remember to check and see if they updated the
        // table to 'SIGNCODE'
        this
            .props
            .removeQueryGraphics();
        const where = "SUPPORTSTATUS = 1 AND SIGNSTATUS = 1 AND MUTCD='" + this.state.selectedMutt + "'";
        const extent = this.props.map.extent;
        const layer = this.props.config.featureURLs.superquery;

        this
            .props
            .querySuperQuery(where, extent, layer)

        // const features =
        // queryLayers(where,extent,this.props.config.featureURLs.Superquery).next();

    }

    render() {
        console.log('this.props.graphic', this.props);
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
                            'size': 50
                        }}/>
                    </div>
                    <div>
                        {this.props.graphic.queryCount}
                        &nbsp;  features found</div>
                    <p>
                        The Extent for the query will be the current extent of the displayed map</p>
                    < button ref={this.myRef} onClick={this.searchClickHandler} disabled={this.selected}>
                        SEARCH</button>

                </div>
            </ModalWrapper>
        )
    }
}
