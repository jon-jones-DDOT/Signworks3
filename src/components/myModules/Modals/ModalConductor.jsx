import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../../redux/reducers/map'

import SupportEditor from '../Support/SupportEditor';
import SignEditor from '../Signs/SignEditor';
import SuperQuery from '../SuperQuery'

function ModalConductor(props) {
 
    switch (props.currentModal) {
        case 'SUPPORT':
            return <SupportEditor {...props}/>
        case 'SIGN':
            return <SignEditor {...props}/>
            case 'QUERY':
            return <SuperQuery {...props}></SuperQuery>
        default:
            return null
    }
}

const mapStateToProps = state => ({map: state.map, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalConductor);
