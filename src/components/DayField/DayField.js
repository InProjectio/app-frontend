import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'
import classes from './DayField.module.scss'
import SelectDay from './SelectDay';
import { renderField } from '../../Form';

class DayField extends Component {
  state = {
    modalIsOpen: false,
    selectedLocation: null
  }

  handleOpenModal = () => {
    const { disabled } = this.props
    if (!disabled) {
      this.setState({
        modalIsOpen: true
      })
    }
  }

  handleClose = () => {
    this.setState({
      modalIsOpen: false
    })
  }

  handleChangeDays = (days) => {
    const { changeValue } = this.props
    changeValue(days)
    this.handleClose()
  }

  handleDeleteDay = (pos) => () => {
    const { disabled } = this.props
    if (!disabled) {
      const { changeValue, value } = this.props
      const newValue = value.filter((v, i) => i !== pos)
      changeValue(newValue)
    }
  }

  render() {
    const { value, disabled } = this.props
    const { modalIsOpen } = this.state
    return (
      <div className={classes.container}>
        <div className={classes.days}>
          { value && value.map((day, i) => (
            <div className={classes.day}
              key={day}
            >
              <p className={classes.date}>
                { moment(day).format('DD.MM.YYYY') },
              </p>
              <p className={classes.dayValue}>
                { moment(day).format('dddd') }
              </p>
              <a className={classNames(classes.clear, disabled && classes.disabled)}
                onClick={this.handleDeleteDay(i)}
              >
                <FontAwesomeIcon icon={faTimes} className={classes.icon} />
              </a>
            </div>
          )) }
        </div>
        <div className={classes.btnWrapper}>
          <a className={classNames('btn btnBlue btnSmall', disabled && classes.disabled)}
            onClick={this.handleOpenModal}
          >
            { (value && value.length > 0)
              ? <FormattedMessage id='DayField.change'
                defaultMessage='Change'
              /> : <FormattedMessage id='DayField.select'
                defaultMessage='Select'
                />
            }
          </a>
        </div>
        <Modal
          show={modalIsOpen}
          onHide={this.handleClose}
          size='lg'
          centered
        >
          <SelectDay handleClose={this.handleClose}
            handleChangeDays={this.handleChangeDays}
            selectedDays={value}
          />
        </Modal>
      </div>
    )
  }
}

export default renderField(DayField)
