import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import classes from './BoardItem.module.scss'
import BoardHeader from '../BoardHeader';
import Task from '../Task'
import arrowIcon from 'images/arrow.svg'
import Loader from 'react-loader-spinner';
import * as Api from 'api/api'
import { useDispatch } from 'react-redux';
import { loadMoreTasksByBoard } from '../../slices';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
});


const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'transparent',
});

const BoardItem = ({ item,
  handleShowTaskForm,
  index,
  searchObj,
  handleGetData,
  handleRollBackData
}) => {
  const dispatch = useDispatch()
  const [ collapse, setCollapse ] = useState(false)
  const [ loadingMore, setLoadingMore ] = useState(false)

  const handleScroll = useCallback(async (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loadingMore) {
      const numberTasks = item.tasks.length
      const count = item.pageInfo?.count || 0
      if (numberTasks < count) {
        const page = Math.round(numberTasks / 10) + 1
        try {
          setLoadingMore(true)

          const result = await Api.get({
            url: '/task/find-tasks-board-loadmore',
            params: {
              ...searchObj,
              groupId: item.id,
              page,
              pageSize: 10
            }
          })

          dispatch(loadMoreTasksByBoard({docs: result.data.docs, index}))

          setLoadingMore(false)
        } catch(e) {
          setLoadingMore(false)
        }
      }
      
    }
  }, [searchObj, loadingMore])

  return (
    <div className={classNames(classes.container, collapse && classes.containerCollapse)}
      key={item.id}
    >
      { !collapse
        && <BoardHeader title={item.title}
            numberTasks={item.pageInfo?.count || 0}
            setCollapse={setCollapse}
          />
      }
      <Droppable droppableId={`${item.id}-${index}`}
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className={classes.scroll}
            onScroll={handleScroll}
          >
            { collapse
              ? <div className={classes.collapse}
                onClick={() => setCollapse(false)}
              >
                <div className={classes.collapseWrapper}>
                  <p className={classes.collapseTitle}>
                    { item.title }
                  </p>
                  <div className={classes.numberTasks}>
                    { item.pageInfo?.count || 0 }
                  </div>
                  <img src={arrowIcon} className={classes.arrowIcon} alt='icon'/>
                </div>
              </div>
              : <div className={classes.boardContent}>
                  {item.tasks.map((task, index) => (
                    <Draggable
                      key={task.task_id}
                      draggableId={`task-${task.task_id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Task item={task}
                            handleShowTaskForm={handleShowTaskForm}
                            handleGetData={handleGetData}
                            handleRollBackData={handleRollBackData}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  { loadingMore
                    && <div className={classes.loader}>
                    <Loader type="Oval" height={20} width={20}/>
                  </div>
                  }
                 
                  <a className={classes.newTask}
                     onClick={() => handleShowTaskForm()}
                  >
                    + New Task
                  </a>
              </div>
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
    </div>
  )
}

export default BoardItem
