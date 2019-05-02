import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import './Banner.css'
import UserAccount from '../UserAccount';
import logo from "../../img/logo.png"

 class Banner extends Component {

    bannerActionHandler = (evt) => {
        
        switch (evt.target.value) {

            case "0":
         
            this
            .props
            .modalClicked(true, "QUERY", null)
                break;
            default:
                //do nothing
                alert('yeet')
                return null;
        }
    }

    render() {
        return (
            <div className="Banner">
                <img src={logo} className="AppLogo"/>

                <div className="AppTools">
                    <select onChange={this.bannerActionHandler}>
                        <option>...Actions</option>
                        <option value={0}>Sign Query</option>
                    </select>
                </div>

                <UserAccount
                    className="UserAccount"
                    user={this.props.auth.user}
                    portal={this.props.auth.user
                    ? this.props.auth.user.portal
                    : null}
                    loggedIn={this.props.auth.loggedIn}
                    signIn={this.signIn}
                    signOut={this.signOut}/>

            </div>
        )
    }
}

const mapStateToProps = state => ({map: state.map, graphic: state.graphic, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);