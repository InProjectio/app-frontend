import React from 'react'
import classNames from 'classnames'
import classes from './Menus.module.scss'

const Menus = ({
  options,
  selectedMenu,
  setSelectedMenu
}) => {
  return (
    <div className={classes.container}>
      { options.map((option) => (
        <div className={classNames(classes.option,
          option.value === selectedMenu && classes.selected)}
          key={option.value}
          onClick={() => {
            setSelectedMenu(option.value)
          }}
        >
          { option.label }
        </div>
      )) }
    </div>
  )
}

export default Menus
