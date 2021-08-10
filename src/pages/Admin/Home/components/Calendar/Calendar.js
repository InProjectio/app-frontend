import CalendarView from 'pages/Admin/ManageTask/CalendarView'
import React from 'react'
import moment from 'moment'
import arrowIcon from 'images/arrow.svg'
import classes from './Calendar.module.scss'
import { useDispatch } from 'react-redux'
import { handleShowTaskForm } from 'layout/AdminLayout/slices'

const Calendar = ({ tasks, calendarInfo, setCalendarInfo }) => {
  const dispatch = useDispatch()

  
  return (
    <div className={classes.container}>
      <p className={classes.title}>
        Calendar
      </p>
      <div className={classes.row}>
        <a className={classes.today}
          onClick={() => {
            setCalendarInfo({
              date: new Date()
            })
          }}
        >
          Today
        </a>
        <a className={classes.back}
          onClick={() => {
            setCalendarInfo({
              date: moment(calendarInfo.date).add(-1, 'day').toDate()
            })
          }}
        >
          <img src={arrowIcon} className={classes.arrowIcon} alt='icon' />
        </a>
        <a className={classes.next}
          onClick={() => {
            setCalendarInfo({
              date: moment(calendarInfo.date).add(1, 'day').toDate()
            })
          }}
        >
          <img src={arrowIcon} className={classes.arrowIcon} alt='icon' />
        </a>
        <p className={classes.date}>
          { moment(calendarInfo.date).format('dddd, MMM DD')}
        </p>
      </div>
      <CalendarView calendarInfo={calendarInfo}
        tasks={tasks}
        handleShowTaskForm={(folder, task) => {
          dispatch(handleShowTaskForm(folder, task))
        }}
        setCalendarInfo={setCalendarInfo}
        customCalendarStyle={classes.calendarStyle}
      />
    </div>
  )
}


export default Calendar
