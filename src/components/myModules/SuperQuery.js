import React, {Component} from 'react'
import './SuperQuery.css'
import ModalWrapper from './Modals/ModalWrapper';
import {layerURLs} from '../../utils/JSAPI'
import Downshift from 'downshift'

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
        //  this.items = this.getOptions();
        this.items = this.formattedMuttArray();
        this
            .props
            .removeQueryGraphics();
    }

    items = [];

    formattedMuttArray = () =>{

        let mutt = [];
        for (let i = 0;i < this.props.map.muttArray.length;i++){
            let leMutt = {};
            leMutt.name = this.props.map.muttArray[i].code.toUpperCase() + ":" + this.props.map.muttArray[i].name.toUpperCase();
            leMutt.id = this.props.map.muttArray[i].id;
            mutt.push(leMutt);

        }
        return mutt;
    }

   
   

    mutcdLookUpSelectHandler = (desc) => {
    
        let option = desc.name.split(':')
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
    inputProps = {size:40,autoFocus:true};
    menuProps = { style:{ listStyle: 'none'}};

    searchClickHandler = (evt) => {
  
        this
            .props
            .removeQueryGraphics();
        const where = "SUPPORTSTATUS = 1 AND SIGNSTATUS = 1 AND SIGNCODE='" + this.state.selectedMutt + "'";
        const extent = this.props.map.extent;
        const layer = layerURLs(this.props).superquery;
console.log('layer', layer)
        this
            .props
            .querySuperQuery(where, extent, layer)

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
                        <Downshift
                           onChange = {(sel) => this.mutcdLookUpSelectHandler(sel)}
                            itemToString={item => (item
                            ? item.name
                            : '')}>
                            {({
                                getInputProps,
                                getItemProps,                               
                                getMenuProps,
                                isOpen,
                                inputValue ,
                                highlightedIndex,
                                selectedItem
                            }) => (
                                <div>
                                    
                                    <input {...getInputProps(this.inputProps)}/>
                                    <ul {...getMenuProps(this.menuProps)}>
                                       
                                        {isOpen
                                            ? this
                                                .items
                                                .filter(item => !inputValue || item.name.includes(inputValue.toUpperCase()))
                                                .map((item, index) => (
                                                    <li
                                                        {...getItemProps({ key: item.id, index, item,
                                                         style: { backgroundColor: highlightedIndex === index ? 
                                                         'lightgray' : 'white', fontWeight: selectedItem === item ? 
                                                         'bold' : 'normal', } })}>
                                                        {item.name}
                                                    </li>
                                                ))
                                            : null}
                                    </ul>
                                </div>
                            )}
                        </Downshift>

                    </div>
                    <div className="bottomDiv">
                         <div >
                        {this.props.graphic.queryCount}
                        &nbsp; features found</div>
                    <p>
                        The Extent for the query will be the extent of the displayed map</p>
                    < button ref={this.myRef} onClick={this.searchClickHandler} disabled={this.selected}>
                        SEARCH</button>
                    </div>
                   

                </div>
            </ModalWrapper>
        )
    }
}
