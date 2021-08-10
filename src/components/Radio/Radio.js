import React, { Component } from 'react'
import classNames from 'classnames'
import classes from './Radio.module.scss'

export default class Radio extends Component {
  render() {
    const { active } = this.props
    return (
      <div className={classNames(classes.container, active && classes.active)}>
        { active
          && <div className={classes.circle} />
        }
      </div>
    )
  }
}
