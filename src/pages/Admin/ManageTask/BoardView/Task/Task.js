import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import classes from './Task.module.scss'
import arrowIcon from 'images/arrow.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import addUserIcon from 'images/add-user.svg'
import SelectMembers from 'components/CreateTask/SelectMembers'
// import closeIcon from 'images/cancel.svg'
import hourglass from 'images/hourglass.svg'
import Popup from 'reactjs-popup';
import SelectDate from 'components/CreateTask/SelectDate'
import EstimateTime from 'components/CreateTask/EstimateTime'
import Loader from 'react-loader-spinner'
import {
  handleAddTaskMember,
  handleRemoveTaskMember,
  updateDueDate,
  updateStartDate,
  updateEstimate
} from 'services/taskService'
import { TASK_STATUS_OBJ } from 'utils/constants'

let rollBackData;

let endDate;

const Task = ({ item, handleShowTaskForm, handleGetData, handleRollBackData }) => {
  const [task, setTask] = useState(item)
  const [loading, setLoading] = useState({})

  useEffect(() => {
    endDate = item.end_date
    if (item.end_date === '') {
      setTimeout(() => {
        dueDateRef.current.open()
      }, 100)
      
    }
    setTask(item)
  }, [item.estimate, item.start_date, item.end_date, item.duedate_reminder, JSON.stringify(item.members)])

  const selectMembersRef = useRef();
  const startDateRef = useRef();
  const dueDateRef = useRef();
  const estimateRef = useRef();

  const handleCloseSelectMembers = () => selectMembersRef.current.close();
  const handleCloseStartDate = () => startDateRef.current.close();
  const handleCloseDueDate = () => {
    dueDateRef.current.close()
  }
  const handleCloseEstimate = () => estimateRef.current.close();

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
      
      handleGetData()
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

  const handleUpdateEndDate = async (end_date, reminder) => {
    try {
      endDate = end_date
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

      handleGetData()

      setLoading((prevLoading) => ({
        ...prevLoading,
        dueDate: false
      }))

    } catch(e) {
      if (rollBackData.end_date === '' && handleRollBackData) {
        handleRollBackData()
      }
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        dueDate: false
      }))
    }
  }

  const handleUpdateStartDate = async (start_date) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        startDate: true
      }))
      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          start_date: moment(start_date).unix(),
        })
      })
      
      await updateStartDate({
        date: start_date,
        task_id: task.task_id
      })

      handleGetData()

      setLoading((prevLoading) => ({
        ...prevLoading,
        startDate: false
      }))

    } catch(e) {
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        startDate: false
      }))
    }
  }

  const handleUpdateEstimate = async (estimate) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        estimate: true
      }))
      setTask((prevTask) => {
        rollBackData = prevTask
        return ({
          ...prevTask,
          estimate,
        })
      })
      await updateEstimate({
        estimate,
        task_id: task.task_id
      })

      handleGetData()

      setLoading((prevLoading) => ({
        ...prevLoading,
        estimate: false
      }))

    } catch(e) {
      setTask(rollBackData)
      setLoading((prevLoading) => ({
        ...prevLoading,
        estimate: false
      }))
    }
  }


  return (
    <div className={classNames(classes.container, 'tooltipBoundary')}
      onClick={() => handleShowTaskForm(task.folders, task)}
    >
      <div className={classes.status}
        style={{ backgroundColor: TASK_STATUS_OBJ[task.status].color }}
      />
      <div className={classes.folderInfo}>
        <p className={classes.text}>
          {task.folders?.projects?.project_name}
        </p>
        <img src={arrowIcon} className={classes.arrowIcon} alt='arrowIcon' />
        <p className={classes.text}>
          { task.folders.folder_name }
        </p>
      </div>
      <div className={classes.row}>
        <p className={classes.taskName}>
          {task.task_name}
        </p>
        <Popup
          ref={selectMembersRef}
          trigger={
            <div className={classes.assignee}>
              {(task.users && task.users.length > 0)
                ? <div className={classes.members}
                  style={{ width: 24 + (task.users.length - 1) * 8 }}
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
        >
          <SelectMembers selectedMembers={task.users}
            handleClose={handleCloseSelectMembers}
            projectId={task.folders?.project_id}
            setSelectedMembers={setSelectedMembers}
          />
        </Popup>
      </div>

      <div className={classes.rowCenter}>
        <Popup
            ref={estimateRef}
            trigger={
              <a className={classes.estimate}>
                <img src={hourglass} className={classes.hourglass} alt='icon' />
                {task.estimate ? `${task.estimate}h` : ''}
                { loading.estimate
                  && <div className={classes.loading}>
                    <Loader type="Oval" color='#7b68ee' height={12} width={12} />
                  </div>
                }
              </a>
            }
            position={['top left']}
          >
            <EstimateTime handleClose={handleCloseEstimate}
              handleChangeEstimateTime={handleUpdateEstimate}
              estimateTime={task.estimate}
            />
          </Popup>
       
        {task.start_date
          && <> <Popup
            ref={startDateRef}
            trigger={
              <div className={classes.date}>
                {/* <a className={classes.btnClose}>
                  <img src={closeIcon} className={classes.closeIcon} alt='icon' />
                </a> */}

                {moment.unix(task.start_date).format('MMM DD')}
                { loading.startDate
                  && <div className={classes.loading}>
                    <Loader type="Oval" color='#7b68ee' height={12} width={12} />
                  </div>
                }
              </div>
            }
            position={['top left']}
          >
            <SelectDate handleClose={handleCloseStartDate}
              handleSelectDate={handleUpdateStartDate}
              currentDate={moment.unix(task.start_date).toDate()}
            />
          </Popup> -
          </>
        }<Popup
            ref={dueDateRef}
            onClose={() => {
              setTimeout(() => {
                if (endDate === '' && handleRollBackData) {
                  handleRollBackData()
                }
              }, 100)
              
            }}
            trigger={
              <div className={classes.date}>
                {/* <a className={classes.btnClose}>
                  <img src={closeIcon} className={classes.closeIcon} alt='icon' />
                </a> */}
                {task.end_date && moment.unix(task.end_date).format('MMM DD')}
                { loading.endDate
                  && <div className={classes.loading}>
                    <Loader type="Oval" color='#7b68ee' height={12} width={12} />
                  </div>
                }
              </div>
            }
            position={['top left']}
          >
            <SelectDate handleClose={handleCloseDueDate}
              handleSelectDate={handleUpdateEndDate}
              showReminder={true}
              currentReminder={task.duedate_reminder}
              currentDate={task.end_date && moment.unix(task.end_date).toDate()}
            />
          </Popup>

      </div>
    </div>
  )
}

export default Task
