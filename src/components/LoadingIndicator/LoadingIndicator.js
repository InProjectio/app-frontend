import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import classes from './LoadingIndicator.module.scss'

export default class LoadingIndicator extends Component {
  render() {
    return <div className={classes.loading}>
      <Loader type="Oval" color={'#007aff'} height={30} width={30} />
    </div>
  }
}