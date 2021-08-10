import React, { useMemo } from 'react'
import classes from './CalendarView.module.scss'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { PERIODS_OBJ } from 'utils/constants'
import { connect } from 'react-redux'
import EventWrapper from './EventWrapper'
import { handleShowTaskForm } from 'layout/AdminLayout/slices'
import classNames from 'classnames'

const localizer = momentLocalizer(moment) // or globalizeLocalizer


const CalendarView = ({ calendarInfo,
  setCalendarInfo,
  tasks,
  handleShowTaskForm,
  customCalendarStyle
}) => {

  const onRangeChange = (date) => {
    
  }

  const handleChangeCalendarInfo = (values) => {
    setCalendarInfo((prevCalendarInfo) => ({
      ...prevCalendarInfo,
      ...values
    }))
  }

  const components = useMemo(() => {
    return {
      eventWrapper: (props) => <EventWrapper {...props} handleShowTaskForm={handleShowTaskForm}/>
    }
  }, [])

  return (
    <div className={classes.container}>
      <div className={classNames(classes.calendar, customCalendarStyle)}>
        <Calendar
          components={components}
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          onRangeChange={onRangeChange}
          view={calendarInfo.view.value}
          views={['day', 'work_week', 'week', 'month']}
          defaultView={'month'}
          date={calendarInfo.date}
          toolbar={false}
          onView={(selectedView) => {
            handleChangeCalendarInfo({
              view: {
                value: selectedView,
                label: PERIODS_OBJ[selectedView]
              }
            })
          }}
          onNavigate={(selectedDate) => {
            handleChangeCalendarInfo({ date: selectedDate })
          }}
          // eventPropGetter={eventStyleGetter}
        />
      </div>

    </div>
  )
}

export default connect(null, {
  handleShowTaskForm
})(CalendarView)
