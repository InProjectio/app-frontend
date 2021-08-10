import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { defineMessages, FormattedMessage } from 'react-intl'
import moment from 'moment'
import classes from './TimeField.module.scss'
import { renderField } from '../../Form';
// import { FormattedField } from '../FormatedField/FormattedField';
import { HOURS } from '../../commons/Constants'
import { SelectField } from '../SelectField/SelectField'

const messages = defineMessages({
  from: {
    id: 'TimeField.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'TimeField.to',
    defaultMessage: 'To'
  }
})

class TimeField extends Component {
  handleChangeSameTime = () => {
    const { value, changeValue, disabled } = this.props
    if (!disabled) {
      const newValue = {
        ...value,
        sameTime: !value.sameTime
      }
      changeValue(newValue)
    }
  }

  handleChangeStartTime = (option) => {
    const { value, changeValue, disabled } = this.props
    if (!disabled) {
      const newValue = {
        ...value,
        startTime: option.value
      }
      changeValue(newValue)
    }
  }

  handleChangeEndTime = (option) => {
    const { value, changeValue, disabled } = this.props
    if (!disabled) {
      const newValue = {
        ...value,
        endTime: option.value
      }
      changeValue(newValue)
    }
  }

  handleChangeArrayStartTime = (pos) => (option) => {
    const { value, changeValue, disabled } = this.props
    if (!disabled) {
      const newHours = value.hours.map((hour, i) => {
        if (pos === i) {
          return {
            ...hour,
            startTime: option.value
          }
        }
        return hour
      })
      const newValue = {
        ...value,
        hours: newHours
      }
      changeValue(newValue)
    }
  }

  handleChangeArrayEndTime = (pos) => (option) => {
    const { value, changeValue, disabled } = this.props
    if (!disabled) {
      const newHours = value.hours.map((hour, i) => {
        if (pos === i) {
          return {
            ...hour,
            endTime: option.value
          }
        }
        return hour
      })
      const newValue = {
        ...value,
        hours: newHours
      }
      changeValue(newValue)
    }
  }

  render() {
    const { value,
      note,
      intl,
      disabled
    } = this.props
    return (
      <div className={classes.container}>
        { value
          && <div className={classes.content}>
            <div className={classes.sameTimeOption}
               onClick={this.handleChangeSameTime}
            >
              <div className={classNames(classes.checkboxWrapper, classes.checkboxActive, disabled && classes.disabled)}
              >
                { value.sameTime
                  && <FontAwesomeIcon icon={faCheck} className={classes.icon} />
                }
              </div>
              <p className={classes.label}>
                <FormattedMessage id='TimeField.sameTime'
                  defaultMessage='Common time for all classes'
                />
              </p>
            </div>
            { value.sameTime
              ? <div className={classes.hour}>
                  <div className={classes.startTime} >
                    {/* <FormattedField value={value.startTime}
                      placeholder={intl.formatMessage(messages.from)}
                      onChange={this.handleChangeStartTime}
                      options={{
                        time: true,
                        timePattern: ['h', 'm']
                      }}
                    /> */}
                    <SelectField value={{
                      label: value.startTime,
                      value: value.startTime
                    }}
                      placeholder={intl.formatMessage(messages.from)}
                      changeValue={this.handleChangeStartTime}
                      options={HOURS}
                      disabled={disabled}
                    />
                  </div>
                  <div className={classes.endTime} >
                    {/* <FormattedField value={value.endTime}
                      placeholder={intl.formatMessage(messages.to)}
                      onChange={this.handleChangeEndTime}
                      options={{
                        time: true,
                        timePattern: ['h', 'm']
                      }}
                    /> */}
                    <SelectField value={{
                      label: value.endTime,
                      value: value.endTime
                    }}
                      placeholder={intl.formatMessage(messages.to)}
                      changeValue={this.handleChangeEndTime}
                      options={HOURS}
                      disabled={disabled}
                    />
                  </div>
                </div>
              : <div className={classes.hours}>
                { value.hours && value.hours.map((hour, i) => (
                  <div key={hour.day}
                    className={classes.hour}
                  >
                    <div className={classes.startTime} >
                      {/* <FormattedField value={hour.startTime}
                        placeholder={intl.formatMessage(messages.from)}
                        onChange={this.handleChangeArrayStartTime(i)}
                        options={{
                          time: true,
                          timePattern: ['h', 'm']
                        }}
                      /> */}
                      <SelectField value={{
                        label: hour.startTime,
                        value: hour.startTime
                      }}
                      placeholder={intl.formatMessage(messages.from)}
                      changeValue={this.handleChangeArrayStartTime(i)}
                      options={HOURS}
                      disabled={disabled}
                    />
                    </div>
                    <div className={classes.endTime} >
                      {/* <FormattedField value={hour.endTime}
                        placeholder={intl.formatMessage(messages.to)}
                        onChange={this.handleChangeArrayEndTime(i)}
                        options={{
                          time: true,
                          timePattern: ['h', 'm']
                        }}
                      /> */}
                      <SelectField value={{
                        label: hour.endTime,
                        value: hour.endTime
                      }}
                      placeholder={intl.formatMessage(messages.to)}
                      changeValue={this.handleChangeArrayEndTime(i)}
                      options={HOURS}
                      disabled={disabled}
                    />
                    </div>
                    <div className={classes.day}>
                      <p className={classes.date}>
                        { moment(hour.day).format('DD.MM.YYYY') },
                      </p>
                      <p className={classes.dayValue}>
                        { moment(hour.day).format('dddd') }
                      </p>
                    </div>
                  </div>
                )) }
              </div>
            }
          </div>
        }
        { note && <p className={classNames(classes.note, !value && classes.mt10)}>
          {typeof note === 'string' ? note : intl.formatMessage(note)}
        </p> }
      </div>
    )
  }
}

export default renderField(TimeField)
