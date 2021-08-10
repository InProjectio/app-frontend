import React, { useState, useEffect } from 'react'
import classes from './ListView.module.scss'
import TaskByStatus from '../TaskByStatus'
import { DragDropContext } from 'react-beautiful-dnd';
import GroupTask from '../GroupTask'
import {
  updateStatus,
  updateDueDate,
  handleAddTaskMember,
  removeAllMembers
} from 'services/taskService'
import EventEmitter from 'utils/EventEmitter';
import moment from 'moment'
import { showNotification } from 'layout/CommonLayout/actions';
import { useDispatch } from 'react-redux';
import { convertFromIdToDate } from 'utils/utils'

let rollbackData;

const ListView = ({searchObj, tasks, tasksByDueDate, setSearchObj, tasksByAssignee, normalTasks}) => {
  const dispatch = useDispatch()
  const [tasksData, setTasksData] = useState(() => {
    if (searchObj.groupBy === 'STATUS') {
      return tasks
    } else if (searchObj.groupBy === 'DUE_DATE') {
      return tasksByDueDate
    } else if (searchObj.groupBy === 'ASSIGNEE'){
      return tasksByAssignee
    }
  })

  useEffect(() => {
    if (searchObj.groupBy === 'STATUS') {
      setTasksData(tasks)
    } else if (searchObj.groupBy === 'DUE_DATE') {
      setTasksData(tasksByDueDate)
    } else if (searchObj.groupBy === 'ASSIGNEE'){
      setTasksData(tasksByAssignee)
    }
   
  }, [searchObj.groupBy, tasks, tasksByDueDate, tasksByAssignee])

  const reorderTask = ({
    sourceIndex,
    source,
    destinationIndex,
    destination,
    task,
    keepSource
  }) => {
    setTasksData((prevTasksData) => {
      rollbackData = prevTasksData
      return prevTasksData.map((item, i) => {
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

  const reorderTaskStatus = ({
    sourceFolderIndex,
    sourceGroupTaskIndex,
    source,
    destinationFolderIndex,
    destinationGroupTaskIndex,
    destination,
    task
  }) => {
    console.log('sourceFolderIndex', sourceGroupTaskIndex, 'destinationFolderIndex', destinationGroupTaskIndex)
    setTasksData((prevTasksData) => {
      rollbackData = prevTasksData
      return prevTasksData.map((groupFolder, folderIndex) => {
        if (folderIndex === +sourceFolderIndex) {
          const newGroupTasks = groupFolder.groupTasks.map((groupTask, groupTaskIndex) => {
            if (+sourceGroupTaskIndex === groupTaskIndex) {
              const newTasks = groupTask.tasks.filter((task, taskIndex) => taskIndex !== source.index )
              return {
                ...groupTask,
                tasks: newTasks
              }
            }
            if (folderIndex === +destinationFolderIndex && groupTaskIndex === +destinationGroupTaskIndex) {
              let newTasks = []
              groupTask.tasks.forEach((item, taskIndex) => {
                if (taskIndex === destination.index) {
                  newTasks = [...newTasks, task]
                }
                newTasks = [...newTasks, item]

              } )

              if (destination.index > newTasks.length - 1) {
                newTasks = [...newTasks, task]
              }
              
              return {
                ...groupTask,
                tasks: newTasks
              }
            }
            return groupTask
          })
          return {
            ...groupFolder,
            groupTasks: newGroupTasks
          }
        }
        if (folderIndex === +destinationFolderIndex) {
          const newGroupTasks = groupFolder.groupTasks.map((groupTask, groupTaskIndex) => {
            if (+destinationGroupTaskIndex === groupTaskIndex) {
              let newTasks = []
              groupTask.tasks.forEach((item, taskIndex) => {
                if (taskIndex === destination.index) {
                  newTasks = [...newTasks, task]
                }
                newTasks = [...newTasks, item]

              } )

              if (destination.index > newTasks.length - 1) {
                newTasks = [...newTasks, task]
              }
              
              return {
                ...groupTask,
                tasks: newTasks
              }
            }
            return groupTask
          })
          return {
            ...groupFolder,
            groupTasks: newGroupTasks
          }
        }
        return groupFolder
      })
    })
  }

  const checkTaskExist = ({destinationIndex, task}) => {
    const findTask = tasksData[+destinationIndex].tasks.find((item) => item.task_id === task.task_id)
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
      if (searchObj.groupBy === 'STATUS') {
        const [sourceId, sourceFolderIndex, sourceGroupTaskIndex] = source.droppableId.split('-')
        const [destinationId, destinationFolderIndex, destinationGroupTaskIndex] = destination.droppableId.split('-')
        console.log('sourceFolderIndex ===>', sourceFolderIndex, tasksData)
        const task = tasksData[sourceFolderIndex].groupTasks[sourceGroupTaskIndex].tasks[source.index]
        const destinationFolderId = tasksData[destinationFolderIndex]?.phase?.folder_id
        reorderTaskStatus({
          sourceFolderIndex,
          sourceGroupTaskIndex,
          source,
          destinationFolderIndex,
          destinationGroupTaskIndex,
          destination,
          task: {
            ...task,
            status: destinationId
          }
        })
        await updateStatus({
          task_id: task?.task_id,
          status: destinationId,
          folder_id: destinationFolderId
        })
        EventEmitter.emit('refreshTasks')
      } else if (searchObj.groupBy === 'DUE_DATE') {
        const [sourceId, sourceIndex] = source.droppableId.split('-')
        const task = tasksData[+sourceIndex].tasks[source.index]
        const [id, destinationIndex] = destination.droppableId.split('-')
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
      } else {
        const [sourceId, sourceIndex] = source.droppableId.split('-')
        const task = tasksData[+sourceIndex].tasks[source.index]
        const [id, destinationIndex] = destination.droppableId.split('-')

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
            const member = tasksData[destinationIndex].user
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
      setTasksData(rollbackData)
    }
  };

  console.log('tasksData ====>', tasksData)
  return (
    <div className={classes.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        {searchObj.groupBy === 'STATUS' && (!searchObj.sorts || searchObj.sorts.length === 0)
          ? <TaskByStatus data={tasksData} searchObj={searchObj}
            setSearchObj={setSearchObj}
          />
          : <>
            {(!searchObj.sorts || searchObj.sorts.length === 0)
              ? <>
                {tasksData && tasksData.map((item, i) => (
                  <GroupTask groupBy={searchObj.groupBy}
                    item={item}
                    key={item.id || i}
                    searchObj={searchObj}
                    setSearchObj={setSearchObj}
                    groupIndex={i}
                  />
                ))}
              </>
              : <GroupTask groupBy={searchObj.groupBy}
                  item={{
                    tasks: normalTasks
                  }}
                  searchObj={searchObj}
                  setSearchObj={setSearchObj}
                  index={0}
                />
            }
           
          </>
        }
      </DragDropContext>
    </div>
  )
}

export default ListView
