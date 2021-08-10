import React from 'react'
import classes from './GroupBy.module.scss'
import Head from '../CreateTask/Head'
import { FormattedMessage } from 'react-intl'
import checkIcon from 'images/check-icon.svg'
import classNames from 'classnames'
import usersIcon from 'images/users.svg'
import statusIcon from 'images/charging-circle.svg'
import calendarIcon from 'images/calendar.svg'

const GROUP_BY = [{
  icon: statusIcon,
  label: 'Status',
  value: 'STATUS'
}, {
  icon: calendarIcon,
  label: 'Due date',
  value: 'DUE_DATE'
}, {
  icon: usersIcon,
  label: 'Assignee',
  value: 'ASSIGNEE'
}]

const ChangeStatus = ({ handleClose, groupBy, handleChangeGroupBy }) => {

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='groupBy' defaultMessage='Group by' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        { GROUP_BY.map((item) => (
          <div key={item.value} className={classes.status}
            onClick={() => {
              handleChangeGroupBy(item.value)
              handleClose()
            }}
          >
            <img src={item.icon} className={classes.icon} alt='icon'/>
            <p className={classNames(classes.stastusText, groupBy === item.value && classes.textbold)}>
              { item.label }
            </p>
            { groupBy === item.value && <img src={checkIcon} className={classes.checlIcon} alt='icon'/> }
          </div>
        )) }

      </div>
    </div>
  )
}

export default ChangeStatus
