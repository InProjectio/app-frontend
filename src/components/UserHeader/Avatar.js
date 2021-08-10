import React, { Component } from 'react'
import avatar from 'images/defaultAvatar.svg'
import { FileURL } from 'utils/config'
import classes from './UserHeader.module.scss'

export default class Avatar extends Component {
  shouldComponentUpdate(nextProps) {
    // console.log('rerender')
    if (nextProps.avatarURL !== this.props.avatarURL) {
      return true
    }
    return false
  }

  render() {
    const { avatarURL } = this.props
    return (
      <img className={classes.avatar} src={avatarURL ? `${FileURL}${avatarURL}` : avatar} alt='avatar'/>
    )
  }
}