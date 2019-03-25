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

    constructor(props) {
        super(props);
        if (this.props.map.selSupport) {
            //       console.log('constructor', this.props.map.selSupport)
        } else {
            //      console.log('constructor', this.props.map.selSupport)
        }
    }

    componentDidMount() {
        if (this.props.map.selSupport) {
            //     console.log('did mount', this.props.map.selSupport)
        } else {
            //    console.log('did mount', this.props.map.selSupport)
        }
    }

    componentDidUpdate() {
        if (this.props.map.selSupport) {
            //   console.log( 'did update', this.props.map.selSupport)
        } else {
            //  console.log('did update', this.props.map.selSupport)
        }
    }

    componentWillUnmount() {
        if (this.props.map.selSupport) {
            //   console.log( 'will unmount', this.props.map.selSupport)
        } else {
            //  console.log('will unmount', this.props.map.selSupport)
        }

    }

    render() {
        // console.log('state', this.props.map)
        if (this.props.map.selSupport) {
            //      console.log('rendered', this.props.map.selSupport)
        } else {
            //      console.log('rendered', this.props.map.selSupport)
        }
        return (

            <RightDiv >
          
                <Support sel={this.props.map.support}/>
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
