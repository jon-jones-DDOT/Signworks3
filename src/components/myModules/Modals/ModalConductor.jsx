import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../../redux/reducers/map'

import SupportEditor from '../Support/SupportEditor';

function ModalConductor(props) {
    switch (props.currentModal) {
        case 'SUPPORT':
        console.log('props into support ed', props)
            return <SupportEditor {...props}/>
        default:
            return null
    }
}

const mapStateToProps = state => ({map: state.map});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalConductor);
