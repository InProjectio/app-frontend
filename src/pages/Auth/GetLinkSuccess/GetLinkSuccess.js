import React from 'react'
import { FormattedMessage } from 'react-intl'
import sendEmailIcon from 'images/sendEmail.png'
import classes from './GetLinkSuccess.module.scss'
import { Link } from 'react-router-dom'

const GetLinkSuccess = () => {
  return (
    <div className={classes.container}>
       <img src={sendEmailIcon} className={classes.icon} alt='icon'/>
      <p className={classes.title}>
        <FormattedMessage id='GetLinkSuccess.title'
          defaultMessage='Welcome back!'
        />
      </p>
      <p className={classes.message}>
        <FormattedMessage id='GetLinkSuccess.message'
          defaultMessage='Recovery link sent'
        />
      </p>

      <p className={classes.note}>
        <FormattedMessage id='GetLinkSuccess.note'
          defaultMessage='go to your inbox'
        />
      </p>

      <p className={classes.or}>
        or 
      </p>

      <Link to='/auth/login'
        className={classes.signin}
      >
        <span className={classes.link}>
          <FormattedMessage id='GetLinkSuccess.signin'
            defaultMessage='Sign in'
          />
        </span>
      </Link>
    </div>
  )
}

export default GetLinkSuccess
