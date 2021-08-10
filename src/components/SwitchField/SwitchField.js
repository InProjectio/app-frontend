import React, { Component } from 'react'
import classNames from 'classnames'
import { renderField } from '../../Form'
import classes from './SwitchField.module.scss'

export class SwitchField extends Component {
  handleChange = ({ active }) => (e) => {
    e.stopPropagation()
    const { input, disabled } = this.props
    if (!disabled) {
      input.onChange(active)
    }
    
  }

  render() {
    const { input, text, size, disabled } = this.props
    return (
      <div className={classNames(classes.wrapper, size === 'md' && classes.md, size === 'lg' && classes.lg)}>
        {input.value
          ? <span onClick={this.handleChange({ active: false })}
            className={classNames(disabled && classes.disabled)}
          >
            <span className={classNames(classes.active, classes.switch, !text && classes.switchEmpty)} /> {text}
          </span>
          : <span onClick={this.handleChange({ active: true })}
            className={classNames(disabled && classes.disabled)}
          >
            <span className={classNames(classes.inActive, classes.switch, !text && classes.switchEmpty)} /> {text}
          </span>
        }
      </div>
    )
  }
}

export default renderField(SwitchField)
