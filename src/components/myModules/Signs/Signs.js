import React, {Component} from 'react'
import Sign from './Sign';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableItem = SortableElement(({value}) => <Sign feature={value}></Sign>);
const SortableList = SortableContainer(({items}) => {
 console.log ('items', items)
    return (
        <div>
            {items.map((value, index) => (<SortableItem key={`item-${index}`} index={index} value={value}/>))}
        </div>

    );
});

export default class Signs extends Component {

    onSortEnd = ({oldIndex, newIndex}) => {

         console.log('indices, old, new', [oldIndex, newIndex])
      const newOrder = [...this.props.signs.signs]
      arrayMove(newOrder, oldIndex, newIndex)
        //     console.log('new array', newOrder)
        for (let i = 0; i < newOrder.length; i++) {
         
            newOrder[i].attributes.SIGNORDER = i;
        
        }
  /* */
    };
    render() {
        if (this.props.signs) {
            return <SortableList items={this.props.signs.signs} onSortEnd={this.onSortEnd}/>;
        } else 
            return <p>Sorry</p>
    }
}
