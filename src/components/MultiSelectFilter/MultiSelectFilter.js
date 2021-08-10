import React, { Component } from 'react'
import classNames from 'classnames'
import classes from './MultiSelectFilter.module.scss'

export default class MultiSelectFilter extends Component {
  render() {
    const { options, selectedValues } = this.props
    return (
      <div className={classes.container}>
        { options && options.map((option) => (
          <div key={option.value}
            className={classNames(classes.option, selectedValues.indexOf(option.value) !== -1 && classes.active)}
          >
            { option.label }
          </div>
        )) }
      </div>
    )
  }
}
