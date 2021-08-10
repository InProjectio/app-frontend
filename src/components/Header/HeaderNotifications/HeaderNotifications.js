import React from 'react'
import classes from './HeaderNotifications.module.scss'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

const HeaderNotifications = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <p className={classes.title}>
          Notifications
        </p>
        <NavLink className={classes.link}
          activeClassName={classes.linkActive}
          to='/notifications/new'
        >
          <FormattedMessage id='HeaderNotifications.new'
            defaultMessage='New'
          />
        </NavLink>
        <NavLink className={classes.link}
          activeClassName={classes.linkActive}
          to='/notifications/cleared'
        >
          <FormattedMessage id='HeaderNotifications.cleared'
            defaultMessage='Cleared'
          />
        </NavLink>
      </div>
      {/* <div className={classes.right}>
        <div className={classNames(classes.filter, classes.filterActive)}>
          <FormattedMessage id='HeaderNotifications.all'
            defaultMessage='All'
          />
        </div>
        <div className={classes.filter}>
          <FormattedMessage id='HeaderNotifications.assignedToMe'
            defaultMessage='Assigned to me'
          />
        </div>
      </div> */}
    </div>
  )
}

export default HeaderNotifications
