import React, { Component } from 'react'
import styled from 'styled-components';
import Support from './Support'

const RightDiv = styled.div` 


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
