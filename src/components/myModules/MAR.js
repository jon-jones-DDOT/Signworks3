import React, {Component} from 'react'
import ModalWrapper from './Modals/ModalWrapper';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {mapModes, actions as graphicActions} from '../../redux/reducers/graphic';
import "./MAR.css"

export  class MAR extends Component {
constructor(props) {
    super(props);
    this.state = {searchText:""}
}

    addressSearch = (evt) => {
        if (evt.which === 13) {
            
          this.props.queryMAR(this.state.searchText)
        }

    }

    textChange = (evt) =>{
       this.setState({searchText:evt.target.value});
      

    }
    cancelClickHandler = (evt) => {
        this
            .props
            .modalClicked(false, null)
    }

    render() {
        return (
            <ModalWrapper{...this.props}
                title="MAR Query"
                width
                ={400}
                showOk={this.props.map.showOk}>

                <div className="MAR">
                    <div
                        className="MARCancel"
                        title="Close Window"
                        onClick={this.cancelClickHandler}>X</div>
                    <p>
                        TYPE AN ADDRESS AND PRESS ENTER</p>
                    <input onKeyPress={this.addressSearch} onChange = {this.textChange} value={this.state.searchText}></input>

                </div>
            </ModalWrapper>
        )
    }
}
const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth: state.auth, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MAR);