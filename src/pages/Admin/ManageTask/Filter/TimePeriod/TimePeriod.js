import React from 'react'
import classes from './TimePeriod.module.scss'
import { FormattedMessage } from 'react-intl'
import { PERIODS } from 'utils/constants'

const TimePeriod = ({ handleClose, handleChangePeriod }) => {
  return (
    <div className={classes.container}>
      <p className={classes.label}>
        <FormattedMessage id='TimePeriod'
          defaultMessage='Time period'
        />
      </p>
      { PERIODS.map((item) => (
        <div className={classes.time}
          key={item.value}
          onClick={() => {
            handleChangePeriod(item)
            handleClose()
          }}
        >
          <p className={classes.text}>
            { item.label }
          </p>
          <div className={classes.type}>
            { item.type }
          </div>
        </div>
      )) }
      
      
    </div>
  )
}

export default TimePeriod
