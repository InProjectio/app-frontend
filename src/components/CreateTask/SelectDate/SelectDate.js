import React, { useState } from 'react'
import moment from 'moment'
import classes from './SelectDate.module.scss'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import Calendar from 'react-calendar';
import Select from '../Select'
import Input from '../Input'

const REMINDERS = [{
  label: 'At time of due date',
  value: 0
}, {
  label: '5 minutes before',
  value: 5
}, {
  label: '10 minutes before',
  value: 10
}, {
  label: '15 minutes before',
  value: 15
}, {
  label: '1 hour before',
  value: 60
}, {
  label: '2 hours before',
  value: 120
}]

const SelectDate = ({ handleClose, showReminder, handleSelectDate, currentDate,
  minDate, maxDate, currentReminder
}) => {
  const [error, setError] = useState('')
  const [ reminder, setReminder ] = useState(currentReminder || 0)

  const [dateText, setDateText] = useState(currentDate
    ? moment(currentDate).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY'))
  const [timeText, setTimeText] = useState(currentDate
    ? moment(currentDate).format('hh:mm A') : moment().format('hh:mm A')) 

  const [date, setDate] = useState(currentDate || new Date())
  const [time, setTime] = useState(currentDate
    ? moment(currentDate).format('hh:mm A') : moment().format('hh:mm A'))

  const handleSetDate = () => {
    const newDate = moment(dateText, 'DD/MM/YYYY')
    if (newDate.isValid()) {
      setDate(newDate.toDate())
    } else {
      setDateText(moment(date).format('DD/MM/YYYY'))
    }
  }

  const handleSetTime = () => {
    const newDate = moment(`${dateText} ${timeText}`, ['DD/MM/YYYY hh:mm A', 'DD/MM/YYYY HH:mm'], true)
    console.log(newDate)
    if (newDate.isValid()) {
      setTime(newDate.format('hh:mm A'))
      setTimeText(newDate.format('hh:mm A'))
    } else {
      setTimeText(time)
    }
  }

  const handleChangeDate = (date) => {
    setDate(date)
    setDateText(moment(date).format('DD/MM/YYYY'))
  }

  const handleSave = () => {
    
    const selectDate = moment(`${dateText} ${timeText}`, ['DD/MM/YYYY hh:mm A', 'DD/MM/YYYY HH:mm'], true).format('YYYY-MM-DD HH:mm:ss')
    console.log('dateText',selectDate, minDate, maxDate)
    if (minDate && selectDate < minDate) {
      setError(`Please select date > ${moment(minDate).format('DD/MM/YYYY HH:mm')}`)
      return
    } else if (maxDate && selectDate > maxDate) {
      setError(`Please select date < ${moment(maxDate).format('DD/MM/YYYY HH:mm')}`)
      return
    }

    handleSelectDate(moment(`${dateText} ${timeText}`, ['DD/MM/YYYY hh:mm A', 'DD/MM/YYYY HH:mm'], true).toDate(), reminder)
    handleClose()
  }


  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='selectDate' defaultMessage='Select date' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <Calendar
          onChange={handleChangeDate}
          value={date}
          // view='month'
        />
        
        <p className={classes.label}>
          <FormattedMessage id='chooseDate' defaultMessage='Choose date' />
        </p>

        <div className={classes.row}>
          <div className={classes.date}>
            <Input value={dateText}
              onChange={setDateText}
              onBlur={handleSetDate}
              placeholder='DD/MM/YYYY'
            />
          </div>
          <div className={classes.time}>
            <Input value={timeText}
              onChange={setTimeText}
              onBlur={handleSetTime}
              placeholder='hh:mm A'
            />
          </div>
        </div>
        { showReminder
          && <>
            <p className={classes.label}>
              <FormattedMessage id='SelectDate.reminder' defaultMessage='Set due date reminder' />
            </p>
            <Select value={reminder}
              handleChange={setReminder}
              options={REMINDERS}
              placeholder='select...'
              name='reminder'
            />
          </>
        }
        
        { error && <p className={classes.error}>
            { error }
          </p>
        }
        <a className={classes.btnSave}
          onClick={handleSave}
        >
          <FormattedMessage id='save' defaultMessage='Save' />
        </a>
      </div>
    </div>
  )
}

export default SelectDate
