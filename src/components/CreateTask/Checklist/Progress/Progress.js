import React from 'react'
import classes from './Progress.module.scss'

const Progress = ({ percent }) => {
  return (
    <div className={classes.container}>
      <p className={classes.percent}>
        {Math.round(percent)}%
      </p>
      <div className={classes.progress}>
        <div className={classes.current}
          style={{
            width: `${percent}%`
          }}
        />
      </div>
    </div>
  )
}

export default Progress
