import React, {Component} from 'react'
import styled from 'styled-components';
import Support from './Support/Support'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import Signs from './Signs/Signs';

const RightDiv = styled.div ` 


 width:30%;
 
`
class RightBar extends Component {

    handleModalClicked = (evt, type) => {
        this.props.modalClicked(true, type)
    }

    render() {
        
        if (this.props.map.selSupport) {
            
        } else {
           
        }
        return (

            <RightDiv >

                <Support sel={this.props.map.support} editClick= {this.handleModalClicked}></Support>
                <Signs signs={this.props.map.signs}></Signs>
            </RightDiv>
        )
    }
}

const mapStateToProps = state => ({map: state.map});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RightBar);
