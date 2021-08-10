import React from 'react'
import classes from './EmptyBox.module.scss'

const EmptyBox = ({text}) => {
  return (
    <div className={classes.container}>
      { text }
    </div>
  )
}

export default EmptyBox
