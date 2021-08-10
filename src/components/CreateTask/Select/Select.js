import React from 'react'
import classNames from 'classnames'
import arrowDownIcon from 'images/arrow-down.svg'
import classes from './Select.module.scss'

const SelectComponent = ({ value, options, handleChange }) => {
  return (
    <div className={classes.container}>
      <select name="cars" id="cars"
        className={classNames(classes.input)}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value={''}>None</option>
        { options && options.map((option, i) => (
          <option key={option.value || i} value={option.value}>{option.label}</option>
        )) }
      </select>

      <img src={arrowDownIcon} className={classes.arrowDownIcon} alt='arrowDownIcon'/>
    </div>
    
  )
}

export default SelectComponent
