import React, { useEffect, useState } from 'react'
import classes from './Notifications.module.scss'
// import defaultAvatar from 'images/defaultAvatar.svg'
import NotificationItem from './NotificationItem'
import * as Api from 'api/api'
import { handleShowTaskForm } from 'layout/AdminLayout/slices'
import { useDispatch } from 'react-redux'
import Empty from './Empty'
import {
  updateDueDate
} from 'services/taskService'
import EventEmitter from 'utils/EventEmitter'

const Notifications = ({ status }) => {
  const dispatch = useDispatch()
  const [ notifications, setNotifications ] = useState([])
  const [ loading, setLoading ] = useState({})

  const getNotifications = async (page) => {
    try {
      const result = await Api.get({
        url: '/task/overdue',
        params: {
          page,
          cleared: status === 'new' ? 'n' : 'y'
        }
      })

      setNotifications(result.data.docs)
    } catch(e) {
      
    }
  }

  const handleChangeNotification = async (task_id, cleared) => {
    try {
      await Api.post({
        url: '/task/clear-task-overdue',
        data: {
          data: [{
            task_id,
            cleared
          }]
        }
      })

      getNotifications(1)
    } catch(e) {
      
    }
  }

  /**
   * listen update task or create task success refresh task
   */
  useEffect(() => {
    const handleRefresh = () => {
      getNotifications()
    }
    EventEmitter.on('refreshTasks', handleRefresh)

    return () => {
      EventEmitter.remove('refreshTasks', handleRefresh)
    }
  }, [])
  
  useEffect(() => {
    getNotifications()
  }, [status])

  const handleShowEditTaskForm = (phase, task) => {
    dispatch(handleShowTaskForm(phase, task))
  }

  const handleUpdateDueDate = async (data) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [data.task_id]: true
      }))
      await updateDueDate(data)
      getNotifications()
      setLoading((prevLoading) => ({
        ...prevLoading,
        [data.task_id]: false
      }))
    } catch(e) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [data.task_id]: false
      }))
    }
    
  }

  return (
    <div className={classes.container}>
      { (notifications && notifications.length > 0)
        ? notifications.map((notification) => (
        <NotificationItem notification={notification}
          key={notification.task_id}
          handleShowTaskForm={handleShowEditTaskForm}
          status={status}
          handleChangeNotification={handleChangeNotification}
          handleUpdateDueDate={handleUpdateDueDate}
          loading={loading[notification.task_id]}
        />
      ))
      : <Empty />
      }
    </div>
  )
}

export default Notifications
