import React, {Component} from 'react'
import Sign from './Sign';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as mapActions } from '../../../redux/reducers/map';

//console.log('map actions', mapActions)
const SortableItem = SortableElement(({value}) => <Sign feature={value}></Sign>);
const SortableList = SortableContainer(({items}) => {
// console.log ('items', items)
    return (
        <div>
            {items.map((value, index) => (<SortableItem key={`item-${index}`} index={index} value={value}/>))}
        </div>

    );
});

 class Signs extends Component {

    onSortEnd = ({oldIndex, newIndex}) => {

    //     console.log('indices, old, new', [oldIndex, newIndex])
      let newOrder = [...this.props.signs.signs]
      newOrder = arrayMove(newOrder, oldIndex, newIndex)
      
      
        //     console.log('new array', newOrder)
        for (let i = 0; i < newOrder.length; i++) {
         
            newOrder[i].attributes.SIGNORDER = i;
        
        }
        
       this.props.signOrderChanged(newOrder, this.props.map.support.selSupport);
  /* */
    };
    render() {
        if (this.props.signs) {
            return <SortableList items={this.props.signs.signs} onSortEnd={this.onSortEnd}/>;
        } else 
            return <p>Sorry</p>
    }
}

const mapStateToProps = state => ({map: state.map});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Signs);