import React from 'react'
import classNames from 'classnames'
import Cleave from 'cleave.js/react';
import onClickOutside from 'react-onclickoutside'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.vi';
import moment from 'moment'
import DateTime from 'react-datetime'
import renderField from '../../Form/renderField'
import classes from './DatePickerField.module.scss'
import 'moment/locale/vi'

const MONTHS = {
  0: true ? 'Tháng 1' : 'Jan',
  1: true ? 'Tháng 2' : 'Feb',
  2: true ? 'Tháng 3' : 'Mar',
  3: true ? 'Tháng 4' : 'Apr',
  4: true ? 'Tháng 5' : 'May',
  5: true ? 'Tháng 6' : 'Jun',
  6: true ? 'Tháng 7' : 'Jul',
  7: true ? 'Tháng 8' : 'Aug',
  8: true ? 'Tháng 9' : 'Sep',
  9: true ? 'Tháng 10' : 'Oct',
  10: true ? 'Tháng 11' : 'Nov',
  11: true ? 'Tháng 12' : 'Dec',
}

class DatePickerField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      openDatePicker: false,
      date: props.viewDate
    }
  }

  moveUpPlaceholder = () => {
    this.setState({
      focus: true,
      openDatePicker: true
    })
  }

  moveDownPlaceholder = () => {
    this.setState({
      focus: false,
    })
  }

  handleCancel = () => {
    this.setState({
      openDatePicker: false
    })
  }

  handleSelectDate = () => {
    const { date } = this.state
    this.props.input.onChange(moment(date).format('DD/MM/YYYY'))
    this.setState({
      openDatePicker: false
    })
  }

  handleChangeDate = (date) => {
    this.props.input.onChange(moment(date).format('DD/MM/YYYY'))
    this.setState({
      openDatePicker: false,
      date
    })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.setState({
        openDatePicker: false
      })
    }
  }

  validation = (currentDate) => (
    currentDate.isBefore(moment(this.props.maxDate))
  )

  renderMonth = (props, month) => <td {...props}>{ MONTHS[month] }</td>

  handleBlurDateTime = () => {
    this.setState({
      openDatePicker: false
    })
  }

  handleClickOutside = () => {
    this.setState({
      openDatePicker: false
    })
  }

  render() {
    const {
      input,
      name,
      type,
      customClass,
      fullBorder,
      label,
      viewMode,
      viewDate,
      hasError,
      h50
    } = this.props
    const { focus, openDatePicker, date } = this.state
    const { lang } = { lang: 'vi' }

    return (
      <div className={classes.inputContainer}
      >
        <Cleave
          label={label}
          onChange={input.onChange}
          value={input.value}
          name={name}
          className={classNames('form-control',
            classes.input,
            fullBorder && classes.fullBorder,
            customClass,
            hasError && classes.errorField,
            focus && classes.focus,
            h50 && classes.h50
          )}
          type={type}
          disabled={openDatePicker}
          onFocus={this.moveUpPlaceholder}
          onBlur={this.moveDownPlaceholder}
          placeholder={ 'DD/MM/YYYY'}
          options={{
            date: true,
            datePattern: ['d', 'm', 'Y']
          }}
          onKeyDown={this.handleKeyDown}
        />
        <div className={classes.dateTimePicker}>

          <DateTime timeFormat={false}
            open={openDatePicker}
            input={false}
            value={date}
            onChange={this.handleChangeDate}
            viewMode={ viewMode || 'years' }
            viewDate={ date || viewDate}
            locale={lang || 'vi'}
            isValidDate={this.validation}
            renderMonth={ this.renderMonth }
            onBlur={this.handleBlurDateTime}
            closeOnSelect={true}
            disableCloseOnClickOutside={false}
          />
        </div>

      </div>

    )
  }
}

export default renderField(onClickOutside(DatePickerField))
