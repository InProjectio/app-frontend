import React, { Component } from 'react'
import arrowLeft from 'images/arrow-left.svg'
import classes from './Back.module.scss'

export default class Back extends Component {
  render() {
    const { children, onClick } = this.props
    return (
      <a className={classes.container}
        onClick={onClick}
      >
        <img src={arrowLeft} alt='arrow-left' className={classes.icon} />
        <span className={classes.text}>
          { children }
        </span>
      </a>
    )
  }
}