import React, { useState, useEffect } from 'react'
import addUserIcon from 'images/add-user.svg'
import calendarCheck from 'images/calendar-check.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import moment from 'moment'
import classes from './TaskRow.module.scss'
import { formatStringToNumber } from 'utils/utils'
import Dropdown from 'components/Dropdown'
import SelectMembers from 'components/CreateTask/SelectMembers'
import SelectDate from 'components/CreateTask/SelectDate'
import Budget from 'components/CreateTask/Budget'
import Spend from 'components/CreateTask/Spend'
import { TASK_STATUS_OBJ } from 'utils/constants'
import {
  updateBudget,
  updateSpend,
  handleAddTaskMember,
  handleRemoveTaskMember,
  updateDueDate
} from 'services/taskService'
import Loader from 'react-loader-spinner'
import EventEmitter from 'utils/EventEmitter'

let rollBackData;

const TaskRow = ({ item, handleShowTaskForm }) => {
  const [task, setTask] = useState(item)
  const [loading, setLoading] = useState({})

  useEffect(() => {
    // console.log('task ---->', task)
    setTask(item)
  }, [item.budget, item.spend, item.end_date, item.duedate_reminder, JSON.stringify(item.users)])

  const handleUpdateBudget = async (budget) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        budget: true
      }))

      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          budget
        })
      })

      await updateBudget({
        budget,
        task_id: task.task_id
      })

      EventEmitter.emit('refreshTasks')

      setLoading((prevLoading) => ({
        ...prevLoading,
        budget: false
      }))

      
    } catch(e) {
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        budget: false
      }))
    }
  }

  const handleUpdateSpend = async (spend) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        spend: true
      }))

      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          spend
        })
      })

      await updateSpend({
        spend,
        task_id: task.task_id
      })

      EventEmitter.emit('refreshTasks')

      setLoading((prevLoading) => ({
        ...prevLoading,
        spend: false
      }))

    } catch(e) {
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        spend: false
      }))
    }
  }

  const handleUpdateEndDate = async (end_date, reminder) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        dueDate: true
      }))
      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          end_date: moment(end_date).unix(),
          duedate_reminder: reminder
        })
      })
      await updateDueDate({
        end_date,
        reminder,
        task_id: task.task_id
      })

      EventEmitter.emit('refreshTasks')

      setLoading((prevLoading) => ({
        ...prevLoading,
        dueDate: false
      }))

    } catch(e) {
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        dueDate: false
      }))
    }
  }

  const setSelectedMembers = async (members, isAdd, changeMembers) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        members: true
      }))

      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          users: members
        })
      })

      if (!isAdd) {
        await handleRemoveTaskMember({
          task_id: task.task_id,
          member: changeMembers[0]
        })
      } else {
        await handleAddTaskMember({
          task_id: task.task_id,
          member: changeMembers[0]
        })
      }

      EventEmitter.emit('refreshTasks')
      

      setLoading((prevLoading) => ({
        ...prevLoading,
        members: false
      }))

    } catch(e) {
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        members: false
      }))
    }
  }

  const renderSelectMembers = (handleClose) => {
    return <SelectMembers handleClose={handleClose}
      selectedMembers={task.users}
      projectId={task.phase.projectId || task.phase.project_id}
      setSelectedMembers={setSelectedMembers}
    />
  }

  const renderSelectDate = (handleClose) => {
    return <SelectDate handleClose={handleClose}
      showReminder={true}
      currentReminder={task.duedate_reminder}
      currentDate={moment.unix(task.end_date).toDate()}
      handleSelectDate={(date, reminder) => {
        handleUpdateEndDate(date, reminder)
      }}
      minDate={moment.unix(task.start_date).toDate()}
    />
  }

  const renderBudget = (handleClose) => {
    return <Budget handleClose={handleClose}
      budget={task.budget}
      setBudget={handleUpdateBudget}
    />
  }

  const renderSpend = (handleClose) => {
    return <Spend handleClose={handleClose}
      spend={task.spend}
      setSpend={handleUpdateSpend}
    />
  }

  return (
    <div className={classes.container}>
      <div className={classes.taskNameWrapper}
        onClick={() => handleShowTaskForm(task.phase, task)}
      >
        <div className={classes.status}
          style={{ backgroundColor: TASK_STATUS_OBJ[task.status].color }}
        />
        <p className={classes.taskName}>
          {task.task_name}
        </p>
      </div>
      <Dropdown mainComponent={
        <div className={classes.assignee}>
          {(task.users && task.users.length > 0)
            ? <div className={classes.members}
              style={{ width: 26 + (task.users.length - 1) * 10 }}
            >
              {task.users.map((item, i) => (
                <img src={item.avatar_url || defaultAvatar}
                  className={classes.avatar}
                  alt='avatar'
                  key={item.user_id || i}
                  style={{
                    left: i * 10,
                    zIndex: 3 - i
                  }}
                />
              ))}
            </div>
            : <div className={classes.assigneeButton}>
              <img src={addUserIcon} className={classes.addUserIcon} alt='addUser' />
            </div>
          }
          { loading.members
            && <div className={classes.loading}>
              <Loader type="Oval" color='#7b68ee' height={12} width={12} />
            </div>
          }
        </div>
      }
        childrenComponent={renderSelectMembers}
      />
      <Dropdown mainComponent={
        <div className={classes.dueDate}
        >
          {task.end_date
            ? moment.unix(task.end_date).format('MMM DD, HH:mm')
            : <a className={classes.btnAddDueDate}>
              <img src={calendarCheck} className={classes.calendarCheck} alt='icon' />
            </a>
          }
          { loading.dueDate
            && <div className={classes.loading}>
              <Loader type="Oval" color='#7b68ee' height={12} width={12} />
            </div>
          }
        </div>

      }
        childrenComponent={renderSelectDate}
      />


      <Dropdown mainComponent={
        <div className={classes.budget}>
          {task.budget ? `$${formatStringToNumber(task.budget)}` : '-'}
          { loading.budget
            && <div className={classes.loading}>
              <Loader type="Oval" color='#7b68ee' height={12} width={12} />
            </div>
          }
          
        </div>
      }
        childrenComponent={renderBudget}
      />
      <Dropdown mainComponent={
        <div className={classes.spend}>
          {task.spend ? `$${formatStringToNumber(task.spend)}` : '-'}
          { loading.spend
            && <div className={classes.loading}>
              <Loader type="Oval" color='#7b68ee' height={12} width={12} />
            </div>
          }
        </div>
      }
        childrenComponent={renderSpend}
      />

    </div>
  )
}

export default TaskRow
