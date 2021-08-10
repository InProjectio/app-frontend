import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import moment from 'moment'
import classes from './CalendarView.module.scss'

export default class Toolbar extends Component {
  handleSelectDay = () => {
    this.props.onView('day')
  }

  handleSelectMonth = () => {
    this.props.onView('month')
  }

  handleBackToList = () => {
  }

  navigateTo = (action) => () => {
    this.props.onNavigate(action)
  }

  render() {
    const { label, view, date } = this.props
    return (
      <div className={classes.toolbar}>
        <div className={classes.navigateDate}>
          <a className={classes.btnBack}
            onClick={this.navigateTo('PREV')}
          >
            <FontAwesomeIcon icon={faAngleLeft} className={classes.icon} />
          </a>
          <p className={classes.currentTime}>
            { view === 'day' ? moment(date).format('dddd, DD.MM.YYYY') : label }
          </p>
          <a className={classes.btnNext}
            onClick={this.navigateTo('NEXT')}
          >
            <FontAwesomeIcon icon={faAngleRight} className={classes.icon} />
          </a>
        </div>

        <div className={classes.right}>
          <div className={classes.viewModeWrapper}>
            <a className={classNames(classes.viewMode, view === 'day' && classes.viewModeActive)}
              onClick={this.handleSelectDay}
            >
              <FormattedMessage id='ActivitiesCalendar.day'
                defaultMessage='Day'
              />
            </a>
            <a className={classNames(classes.viewMode, view === 'month' && classes.viewModeActive)}
              onClick={this.handleSelectMonth}
            >
              <FormattedMessage id='ActivitiesCalendar.month'
                defaultMessage='Month'
              />
            </a>
          </div>
          <a className={classes.btnBackToList}
            onClick={this.handleBackToList}
          >
            <FormattedMessage id='ActivitiesCalendar.list'
              defaultMessage='List'
            />
          </a>
        </div>
      </div>
    )
  }
}
