import React from 'react'
import classNames from 'classnames'
import arrowDownIcon from 'images/arrow-down.svg'
import classes from './Select.module.scss'
import { renderField } from 'Form'

export const SelectComponent = ({ input, options }) => {
  return (
    <div className={classes.container}>
      <select name="cars" id="cars"
        className={classNames(classes.input)}
        value={input.value}
        onChange={(e) => input.onChange(e.target.value)}
      >
        { options && options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        )) }
      </select>

      <img src={arrowDownIcon} className={classes.arrowDownIcon} alt='arrowDownIcon'/>
    </div>
    
  )
}

export default renderField(SelectComponent)
