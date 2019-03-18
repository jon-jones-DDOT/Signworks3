import React, { Component } from 'react'
import styled from 'styled-components';
import Support from './Support/Support'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../../redux/reducers/map';

const RightDiv = styled.div` 

background-color:lightblue;
 width:30%;
 
`
 class RightBar extends Component {
  render() {
   // console.log('state', this.props.map)
   
    return (
     <RightDiv >
        <Support  sel = {this.props.map.selSupport}/>
     
          </RightDiv>
    )
  }
}


const mapStateToProps = state => ({
  
  map: state.map
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (RightBar);
