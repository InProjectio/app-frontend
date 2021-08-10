import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight
} from '@fortawesome/free-solid-svg-icons'
import classes from './DayField.module.scss'

export default class DayPickerNavBar extends Component {
  handleBack = () => {
    this.props.onPreviousClick()
  }

  handleNext = () => {
    this.props.onNextClick()
  }

  render() {
    return (
      <div className={classes.dayPickerNavBar}>
        <a className={classes.btnBack}
          onClick={this.handleBack}
        >
          <FontAwesomeIcon icon={faAngleLeft} className={classes.icon} />
        </a>
        <a className={classes.btnNext}
          onClick={this.handleNext}
        >
          <FontAwesomeIcon icon={faAngleRight} className={classes.icon} />
        </a>
      </div>
    )
  }
}
