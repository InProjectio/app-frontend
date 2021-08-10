import React, { useState, useEffect } from 'react'
import { TASK_STATUS_OBJ } from 'utils/constants'
import classes from './Task.module.scss'
import arrowIcon from 'images/arrow.svg'
import trashIcon from 'images/trash.svg'
import checkIcon from 'images/check-icon.svg'
import classNames from 'classnames'
import Dropdown from 'components/Dropdown'
import PopupConfirm from 'components/CreateTask/Checklist/PopupConfirm'
import { FormattedMessage } from 'react-intl'
import addUser from 'images/add-user.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import SelectMembers from 'components/CreateTask/SelectMembers'
import ChangeStatus from 'components/CreateTask/ChangeStatus'
import {
  handleAddTaskMember,
  handleRemoveTaskMember,
  updateStatus,
  handleDeleteTask
} from 'services/taskService'
import EventEmitter from 'utils/EventEmitter'
import Loader from 'react-loader-spinner'

let rollBackData;

const Task = ({ item, hideActions, handleShowTaskForm }) => {
  const [task, setTask] = useState(item)
  const [loading, setLoading] = useState(0)

  useEffect(() => {
    setTask(item)
  }, [item.status, item.end_date, item.duedate_reminder, JSON.stringify(item.members)])

  const deleteTask = async () => {
    try {
      setLoading(prev => prev + 1)

      await handleDeleteTask(task.task_id)
      
      EventEmitter.emit('refreshTasks')
      setLoading(prev => prev - 1)

    } catch(e) {
      setLoading(prev => prev - 1)
    }
  }

  const handleChangeStatus = async (status) => {
    try {
      setLoading(prev => prev + 1)

      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          status
        })
      })

      await updateStatus({
        task_id: task.task_id,
        status
      })
      
      EventEmitter.emit('refreshTasks')
      setLoading(prev => prev - 1)

    } catch(e) {
      setTask(rollBackData)
      setLoading(prev => prev - 1)
    }
  }

  const setSelectedMembers = async (members, isAdd, changeMembers) => {
    try {
      setLoading(prev => prev + 1)

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
      setLoading(prev => prev - 1)

    } catch(e) {
      setTask(rollBackData)
      setLoading(prev => prev - 1)
    }
  }

  // console.log('task ===>', task)

  return (
    <div className={classes.container}>
      
      <Dropdown mainComponent={
         <div className={classes.statusWrapper}
          style={{
            borderColor: TASK_STATUS_OBJ[task.status].color
          }}
        >
          <div className={classes.status}
            style={{
              backgroundColor: TASK_STATUS_OBJ[task.status].color
            }}
          />
        </div>
        }
          childrenComponent={(handleClose) => (
            <ChangeStatus handleClose={handleClose}
              statusInput={task.status}
              handleChangeStatus={handleChangeStatus}
            />
          )}
        />
      
      <div className={classes.infoWrapper}
        onClick={() => handleShowTaskForm(task.folders, task)}
      >
        <div className={classes.folderInfo}>
          <p className={classes.text}>
            {task.workspaces?.workspace_name}
          </p>
          <img src={arrowIcon} className={classes.arrowIcon} alt='arrowIcon' />
          <p className={classes.text}>
            {task.projects?.project_name}
          </p>
          <img src={arrowIcon} className={classes.arrowIcon} alt='arrowIcon' />
          <p className={classes.text}>
            {task.folders?.folder_name}
          </p>
        </div>
        <p className={classes.taskName}>
          {task.task_name}
        </p>
      </div>

      <div className={classes.actions}>
        <Dropdown mainComponent={
          <a className={classNames(classes.btn)}
          >
            <img src={checkIcon} className={classes.checkIcon} alt='clock' />
          </a>
        }
          childrenComponent={(handleClose) => (
            <ChangeStatus handleClose={handleClose}
              statusInput={task.status}
              handleChangeStatus={handleChangeStatus}
            />
          )}
        />

        <Dropdown mainComponent={
          <div className={classNames(classes.btn,
            classes.btnAddUser)}
          >
            {(task.members && task.members.length > 0)
              ? <div className={classes.members}
                style={{ width: 20 + (task.members.length - 1) * 10 }}
              >
                {task.members.map((member, i) => (
                  <img src={member.avatar_url || defaultAvatar}
                    className={classes.avatar}
                    alt='avatar'
                    key={member.user_id || i}
                    style={{
                      left: i * 10,
                      zIndex: 3 - i
                    }}
                  />
                ))}
              </div>
              : <img src={addUser} className={classes.addUser} alt='clock' />
            }

          </div>
        }
          childrenComponent={(handleClose) => (
            <div className={classes.wrapper}>
              <SelectMembers selectedMembers={task.members}
                setSelectedMembers={setSelectedMembers}
                handleClose={handleClose}
                projectId={task.projects.project_id}
                hideSelectAll={true}
              />
            </div>
          )}
        />

        <Dropdown mainComponent={
          <a className={classNames(classes.btn, classes.btnDelete)}
          >
            <img src={trashIcon} className={classes.trash} alt='clock' />
          </a>
        }
          childrenComponent={(handleClose) => (
            <PopupConfirm title={<FormattedMessage id='Task.delete'
              defaultMessage='Delete task?'
            />}
              message={<FormattedMessage id='Task.deleteMessage'
                defaultMessage='Do you want to delete this task?'
              />}
              btnText={
                <FormattedMessage id='Task.deleteTask'
                  defaultMessage='Delete task'
                />
              }
              handleClose={handleClose}
              handleClick={deleteTask}

            />
          )}
        />
       
      </div>
      { loading > 0
        && <div className={classes.loading}>
          <Loader type="Oval" color='#7b68ee' height={20} width={20} />
        </div>
      }
      
    </div>
  )
}

export default Task
