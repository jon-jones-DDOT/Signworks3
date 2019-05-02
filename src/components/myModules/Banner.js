import React, { Component } from 'react'
import './Banner.css'
import UserAccount from '../UserAccount';
import logo from "../../img/logo.png"

export default class Banner extends Component {
  render() {
    return (
      <div>
           <img src={logo}/>
       <UserAccount
            user={this.props.auth.user}
            portal={this.props.auth.user ? this.props.auth.user.portal : null}
            loggedIn={this.props.auth.loggedIn}
            signIn={this.signIn}
            signOut={this.signOut}
          />
      </div>
    )
  }
}
