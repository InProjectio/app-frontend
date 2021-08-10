import React from 'react'
import classes from './Planning.module.scss'
import { FormattedMessage } from 'react-intl'
import emailIcon from 'images/email.png'
import reviewImg from 'images/review.png'
import planingBanner from 'images/planning-banner.png'

const Planning = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <p className={classes.title}>
          <FormattedMessage id='Planning.title'
            defaultMessage='One place for all your work.'
          />
        </p>
        <p className={classes.description}>
          <FormattedMessage id='Planning.description'
            defaultMessage='Save one day every week. Guaranteed.'
          />
        </p>
        <div className={classes.enterEmailWrapper}>
          <div className={classes.divider} />
          <img src={emailIcon} className={classes.mailIcon} alt='icon'/>
          <input className={classes.input}
            placeholder='Enter your email'
          />
        </div>
        <div className={classes.row}>
          <a className={classes.getStarted}>
            <FormattedMessage id='Planning.getStarted'
              defaultMessage='Get Started'
            />
          </a>
          <p className={classes.note}>
            <FormattedMessage id='Planning.note'
              defaultMessage='Very low price for you'
            />
          </p>
        </div>

        <img src={reviewImg} className={classes.review} alt='review'/>
      </div>

      <div className={classes.banner}>
        <img src={planingBanner} className={classes.planingBanner} alt='banner'/>
      </div>
    </div>
  )
}

export default Planning
