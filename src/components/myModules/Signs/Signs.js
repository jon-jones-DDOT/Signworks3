import React, {Component} from 'react'
import Sign from './Sign';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';


const SortableItem = SortableElement(({value}) => <Sign feature = {value}></Sign>);
const SortableList = SortableContainer(({items}) => {
 
    return (
       <div>
 {items.map((value, index) => (<SortableItem key={`item-${index}`} index={index} value={value}/>))}
       </div>
           
        
    );
});



export default class Signs extends Component {
   
    onSortEnd = ({oldIndex, newIndex}) => {
      /*  this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex)
        }));
        */
    };
    render() {
      if(this.props.signs){
        return <SortableList items={this.props.signs.signs} onSortEnd={this.onSortEnd}/>;
      }
      else
      return <p>Sorry</p>
    }
}


/*
export default class Signs extends Component {

   makeSigns = (recs) => {
     if(recs.length ===0){
       return 'no signs'
     }
    return recs.map( (r,index) => {
       return <Sign feature = {r.attributes} key={index}
        />
    })
}


  render() {

    return (
      <div>
       { this.props.signs?this.makeSigns(this.props.signs.signs):'none'}
      </div>
    )
  }
}

*/
