import React, { Component } from 'react'
import Sign from './Sign';

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
