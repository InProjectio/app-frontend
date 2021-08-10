import React, { useState } from 'react'
import Expand from 'react-expand-animated';
import classes from './ListTasks.module.scss'
import downIcon from 'images/arrow-white.svg'
import classNames from 'classnames'
import Task from '../Task';
import noTaskToday from 'images/no-task-today.png'
import { useDispatch } from 'react-redux';
import { handleShowTaskForm } from 'layout/AdminLayout/slices'

const ListTasks = ({ label, tasks, allowCollapseExpand, value }) => {
  const [show, setShow] = useState(true)
  const dispatch = useDispatch()
  return (
    <div className={classes.container}>
      <div className={classes.btn}
        onClick={() => {
          if (allowCollapseExpand) {
            setShow((prev) => !prev)
          }
        }}
      >
        { allowCollapseExpand
          && <div className={classes.arrowWrapper}>
            <img src={downIcon}
              alt='down'
              className={classNames(classes.icon, show ? classes.iconUp : classes.iconDown)}
            />
          </div>
        }
        <p className={classes.label}>
          { label }
        </p>
        { tasks?.length > 0
          && <span className={classes.numberTasks}>
            ({tasks?.length})
          </span>
        }
      </div>
      <Expand open={show}
        duration={300}
      >
        <div className={classes.tasks}>
          { (tasks && tasks.length > 0) ? tasks.map((task) => (
            <div className={classes.task} key={task.task_id}>
              <Task item={task}
                key={task.task_id}
                hideActions={value === 'done'}
                handleShowTaskForm={(folder, task) => {
                  dispatch(handleShowTaskForm(folder, task))
                }}/>
            </div>
          ))
            : <>
            { value === 'today'
              ? <div className={classes.noTasks}>
                <img className={classes.noTaskToday} src={noTaskToday} alt='img'/>
                <p className={classes.emptyTitle}>
                  Woohoo, Inbox zero!
                </p>
                <p className={classes.emptyDescription}>
                  Tasks and Reminders that are scheduled for Today will appear here.
                </p>
              </div>
              : <div className={classes.noTasks}>
                No overdue tasks or reminders scheduled.
              </div>
            }
           
            </>
          }
        </div>

      </Expand>
    </div>
  )
}

export default ListTasks
