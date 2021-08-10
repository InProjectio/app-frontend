import React, { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import PerfectScrollbar from 'react-perfect-scrollbar'
import classes from './BoardView.module.scss'
import BoardItem from './BoardItem';
import { handleShowTaskForm } from 'layout/AdminLayout/slices'
import { useDispatch } from 'react-redux';
import {
  updateStatus,
  updateDueDate,
  removeAllMembers,
  handleAddTaskMember,
} from 'services/taskService'
import EventEmitter from 'utils/EventEmitter';
import moment from 'moment'
import { showNotification } from 'layout/CommonLayout/actions';
import { convertFromIdToDate } from 'utils/utils'

let rollbackData;

const BoardView  = ({ tasksGroup, searchObj, handleGetData }) => {
  const [tasksByBoard, setTasksByBoard] = useState(tasksGroup || [])

  useEffect(() => {
    console.log('<======= BoardView =======>')
    setTasksByBoard(tasksGroup)
  }, [tasksGroup])

  const dispatch = useDispatch()

  const reorderTask = ({
    sourceIndex,
    source,
    destinationIndex,
    destination,
    task,
    keepSource
  }) => {
    setTasksByBoard((prevTasksByBoard) => {
      rollbackData = prevTasksByBoard
      return prevTasksByBoard.map((item, i) => {
      if (i === +sourceIndex && !keepSource) {
        return {
          ...item,
          tasks: item.tasks.filter((task, j) => j !== +source.index)
        }
      } else if (i === +destinationIndex) {
        let newTasks = []
        item.tasks.forEach((item, j) => {
          if (j === +destination.index) {
            newTasks = [...newTasks, task ]
          }
          newTasks = [...newTasks, item]
        })
        if (destination.index > item.tasks.length - 1) {
          newTasks = [...newTasks, task ]
        }
        return {
          ...item,
          tasks: newTasks
        }
      }
      return item
    })})
  }

  const checkTaskExist = ({destinationIndex, task}) => {
    const findTask = tasksByBoard[+destinationIndex].tasks.find((item) => item.task_id === task.task_id)
    return !!findTask
  }

  const onDragEnd = async (result) => {
    try {
      const { source, destination } = result;

      console.log('source ===>', source)
      console.log('destination ====>', destination)
      if (!destination) {
        return;
      }
  
      if (source.droppableId === destination.droppableId) {
  
      } else {
        const [sourceId, sourceIndex] = source.droppableId.split('-')
        const task = tasksByBoard[+sourceIndex].tasks[source.index]
        const [id, destinationIndex] = destination.droppableId.split('-')
        
        if (searchObj.groupBy === 'STATUS') {
          reorderTask({
            source,
            sourceIndex,
            destination,
            destinationIndex,
            task: {
              ...task,
              status: id
            }
          })
          await updateStatus({
            status: id,
            task_id: task?.task_id
          })
          EventEmitter.emit('refreshTasks')
        } else if (searchObj.groupBy === 'DUE_DATE') {
          if (sourceId === 'done') {
            dispatch(showNotification({
              type: 'ERROR',
              message: 'Cannot change status done'
            }))
            return
          }
          const newDate = convertFromIdToDate(id)
          if (newDate) {
            const time = moment.unix(task.end_date).format('HH:mm:ss')
            const end_date = `${newDate} ${time}`
            reorderTask({
              source,
              sourceIndex,
              destination,
              destinationIndex,
              task: {
                ...task,
                end_date: moment(end_date).unix()
              }
            })
            await updateDueDate({
              task_id: task?.task_id,
              end_date,
              reminder: task.duedate_reminder
            })
            EventEmitter.emit('refreshTasks')
          } else {
            // handle show due date
            if (id === 'done') {
              reorderTask({
                source,
                sourceIndex,
                destination,
                destinationIndex,
                task: {
                  ...task,
                  status: 'done'
                }
              })
              await updateStatus({
                status: 'ready',
                task_id: task?.task_id
              })
              EventEmitter.emit('refreshTasks')
            } else  {
              reorderTask({
                source,
                sourceIndex,
                destination,
                destinationIndex,
                task: {
                  ...task,
                  end_date: ''
                }
              })
            }
          }
          
        } else if (searchObj.groupBy === 'ASSIGNEE') {
          if (id === 'unassign') {
            reorderTask({
              source,
              sourceIndex,
              destination,
              destinationIndex,
              task: {
                ...task,
                users: []
              }
            })
            await removeAllMembers({
              task_id: task?.task_id,
            })
            EventEmitter.emit('refreshTasks')
          } else {
            const exist = checkTaskExist({
              destinationIndex,
              task
            })
            if (exist) {
              dispatch(showNotification({
                type: 'ERROR',
                message: 'Task is existed!'
              }))
            } else {
              const member = tasksByBoard[destinationIndex].users[0]
              reorderTask({
                source,
                sourceIndex,
                destination,
                destinationIndex,
                task: {
                  ...task,
                  users: [...task.users, member]
                },
                keepSource: sourceId !== 'unassign'
              })
              await handleAddTaskMember({
                member,
                task_id: task?.task_id
              })
              EventEmitter.emit('refreshTasks')

            }
          }
        }
        
      }
    } catch(e) {
      console.log('e ===>', e)
      setTasksByBoard(rollbackData)
    }
    
  };

  const handleShowTaskFormModal = (phase, task) => {
    dispatch(handleShowTaskForm(phase, task))
  }

  const handleRollBackData = () => {
    setTasksByBoard(rollbackData)
  }

  console.log('tasksByBoard ===>', tasksByBoard)

  return (
    <div className={classes.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <PerfectScrollbar className={classes.boards}>
          { tasksByBoard.map((item, i) => (
            <BoardItem item={item}
              key={item.id}
              handleShowTaskForm={handleShowTaskFormModal}
              searchObj={searchObj}
              index={i}
              handleGetData={handleGetData}
              handleRollBackData={handleRollBackData}
            />
          )) }
        </PerfectScrollbar>
        
      </DragDropContext>
    </div>
  )
}

export default BoardView