import React, {Component} from 'react'
import styled from 'styled-components';
import Support from './Support/Support'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import Signs from './Signs/Signs';

const RightDiv = styled.div ` 


 width:30%;
 
`
class RightBar extends Component {
   
    handleModalClicked = (evt, type, index) => {
    
        this.props.modalClicked(true, type, index)
    }
   

    render() {
      
      
        return (

            <RightDiv >

                <Support sel={this.props.map.support} editClick= {this.handleModalClicked}></Support>
                <Signs signs={this.props.map.signs} editClick = {this.handleModalClicked}></Signs>
            </RightDiv>
        )
    }
}

const mapStateToProps = state => ({map: state.map, graphic:state.graphic});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RightBar);
