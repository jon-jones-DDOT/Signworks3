import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../../redux/reducers/map'
import {actions as graphicsActions} from '../../../redux/reducers/graphic'

import SupportEditor from '../Support/SupportEditor';
import SignEditor from '../Signs/SignEditor';
import SuperQuery from '../SuperQuery'
import MAR from '../MAR';

function ModalConductor(props) {

    switch (props.map.currentModal) {
        case 'SUPPORT':
            return <SupportEditor {...props}/>
        case 'SIGN':
            return <SignEditor {...props}/>
            case 'QUERY':
            return <SuperQuery {...props}></SuperQuery>
            case 'MAR':
                
                return <MAR {...props}></MAR>
        default:
            return null
    }
}

const mapStateToProps = state => ({map: state.map, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicsActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalConductor);
