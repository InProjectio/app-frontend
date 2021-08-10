import React, { useEffect, useState } from 'react'
import classes from './Home.module.scss'
// import CreateTask from 'components/CreateTask'
import saga from './saga'
import reducer, {
  getTasksCompleteInday,
  getTasksTodo,
  getTasksToday
} from './slices'
import {
  selectTasksToday,
  selectTasksTodo,
  selectTasksComplete
} from './selector'
import { useInjectReducer } from 'utils/injectReducer'
import { useInjectSaga } from 'utils/injectSaga'
import { useDispatch, useSelector } from 'react-redux'
import EventEmitter from 'utils/EventEmitter'
import Calendar from './components/Calendar'
import { createStructuredSelector } from 'reselect'
import moment from 'moment'
import ListTasks from './components/ListTasks'
import Menus from './components/Menus'

const mapStateToProps = createStructuredSelector({
  tasksToday: selectTasksToday(),
  tasksTodo: selectTasksTodo(),
  tasksComplete: selectTasksComplete(),
})

const Home = () => {
  const [calendarInfo, setCalendarInfo] = useState({
    view: {
      value: 'day'
    },
    date: new Date()
  })

  const [ selectedMenu, setSelectedMenu ] = useState('TODO')

  useInjectReducer({ key: 'home', reducer })
  useInjectSaga({ key: 'home', saga })

  const dispatch = useDispatch()

  const {
    tasksToday,
    tasksComplete,
    tasksTodo
  } = useSelector(mapStateToProps)

  console.log('tasksTodo===>', tasksTodo)

  useEffect(() => {
    handleGetData()
  }, [])

  const handleGetData = () => {
    dispatch(getTasksCompleteInday())
    dispatch(getTasksToday(moment(calendarInfo.date).unix()))
    dispatch(getTasksTodo())
  }

  const handleChangeCalendarInfo = (values) => {
    setCalendarInfo((prev) => ({
      ...prev,
      ...values
    }))
    if (values.date) {
      dispatch(getTasksToday(moment(values.date).unix()))
    }
  }

  /**
   * listen update task or create task success refresh task
   */
  useEffect(() => {
    const handleRefresh = () => {
      handleGetData()
    }
    EventEmitter.on('refreshTasks', handleRefresh)

    return () => {
      EventEmitter.remove('refreshTasks', handleRefresh)
    }
  }, [])


  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div className={classes.menus}>
          <Menus options={[{
            label: 'To do',
            value: 'TODO'
          }, {
            label: 'Done',
            value: 'DONE'
          }]}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          
          />
        </div>
        { selectedMenu === 'TODO'
          && tasksTodo.map((item) => (
            <ListTasks label={item.label}
              tasks={item.tasks}
              key={item.value}
              value={item.value}
              allowCollapseExpand={true}
            />
          ))
        }
        { selectedMenu === 'DONE'
          && <ListTasks label={'DONE'}
            tasks={tasksComplete}
            value={'done'}
          />
        }
      </div>
      <div className={classes.calendar}>
        <Calendar tasks={tasksToday}
          getTasksToday={getTasksToday}
          calendarInfo={calendarInfo}
          setCalendarInfo={handleChangeCalendarInfo}
        />
      </div>
    </div>
  )
}

export default Home
