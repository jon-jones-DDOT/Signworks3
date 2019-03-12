import React, { Component } from 'react'
import styled from 'styled-components';
import Support from './Support/Support'

const RightDiv = styled.div` 

background-color:lightblue;
 width:30%;
 
`

export default class RightBar extends Component {
  render() {
    return (
     <RightDiv >
        <Support />
          </RightDiv>
    )
  }
}
