import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import {mapModes} from '../../redux/reducers/graphic'
import './Banner.css'
import UserAccount from '../UserAccount';
import logo from "../../img/logo.png"

class Banner extends Component {

    bannerToolHandler = (evt) => {

        switch (evt.target.value) {
            case '0':
            this.props.setMapClickMode(mapModes.SELECT_SUPPORT_MODE, 'default')
                break;
            case "1": //SuperQuery™

                this
                    .props
                    .modalClicked(true, "QUERY", null);
                evt.target.value = '0'
                break;
            case "2":
                
                    this.props.setMapClickMode(mapModes.ADD_SUPPORT_MODE, 'crosshair')

                break;
            default:
                //do nothing

                return null;
        }
    }

    bannerActionHandler = (evt) => {
        switch (evt.target.value) {
            case '1':
                this
                    .props
                    .removeQueryGraphics();
                evt.target.value = "0"
                break;
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="Banner">
                <img src={logo} className="AppLogo"/>

                <div className="AppTools">
                    <span>
                        <select onChange={this.bannerToolHandler} className="ActionSelect">
                            <option value={0}>...Tools</option>
                            <option value={1}>Sign Query</option>
                            <option value={2}>Add Support</option>
                        </select>
                    </span>
                    <span>
                        <select onChange={this.bannerActionHandler} className="ActionSelect">
                            <option value={0}>...Actions</option>
                            <option value={1}>Clear Query Graphics</option>
                        </select>
                    </span>

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