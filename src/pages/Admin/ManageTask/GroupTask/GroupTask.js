import React, { useState, useMemo } from 'react'
import arrowDown from 'images/arrow-down.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import sortIcon from 'images/sort-icon.svg'
import caretDown from 'images/caret-down-white.svg'
import classes from './GroupTask.module.scss'
import Expand from 'react-expand-animated'
import classNames from 'classnames'
import { Droppable, Draggable } from 'react-beautiful-dnd';
// import Dropdown from 'components/Dropdown'
// import PopupSort from 'components/PopupSort'
import TaskRow from '../TaskRow'
import { connect } from 'react-redux'
import { handleShowTaskForm } from 'layout/AdminLayout/slices'
import { TASK_STATUS_OBJ } from 'utils/constants'
import closeWhite from 'images/close-white.svg'

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const Sort = ({sortObj,
  sortName,
  sortIndexObj,
  handleAddSort,
  handleUpdateSort,
  handleDeleteSort
}) => (
    <div className={classNames(classes.btnSort, sortObj[sortName] && classes.btnSortActive)}>
     { !sortObj[sortName]
        ? <a className={classes.sortWrapper}
            onClick={() => handleAddSort(sortName)}
          >
            <img src={sortIcon} className={classes.sortIcon} alt='sort-icon' />
          </a>
        : <a className={classes.sortActive}
            onClick={() => handleUpdateSort(sortName)}
          >
            { sortIndexObj[sortName] }
            <img src={caretDown}
              className={classNames(classes.caretDown, sortObj[sortName]==='ASC' && classes.caretUp)}
              alt='icon'/>
          </a>
      }
      {sortObj[sortName]
        && <a className={classes.btnClose}
          onClick={() => handleDeleteSort(sortName)}
        >
          <img src={closeWhite} className={classes.closeWhite} alt='icon'/>
        </a>
      }
    </div>
)

const GroupTask = ({ item, groupBy, handleShowTaskForm, setSearchObj, searchObj, groupIndex }) => {
  const {sortObj, sortIndexObj, sorts} = useMemo(() => {
    const sortObj = {}
    const sortIndexObj = {}
    console.log('searchObj.sorts', searchObj.sorts)
    if (searchObj.sorts) {
      searchObj.sorts.forEach((item, i) => {
        sortObj[item.sortName] = item.sortType
        sortIndexObj[item.sortName] = i + 1
      });
    }
    
    return {
      sortObj,
      sortIndexObj,
      sorts: searchObj.sorts || []
    }
  }, [searchObj.sorts])
  const [openTasks, setOpenTasks] = useState(true)

  

  const toggleStatus = () => {
    setOpenTasks((prevOpenTasks) => !prevOpenTasks)
  }

  // const renderPopupSort = (handleClose) => {
  //   return <PopupSort handleClose={handleClose} />
  // }

  const handleAddSort = (sortName) => {
    setSearchObj({
      ...searchObj,
      sorts: [
        ...sorts,
        {sortName, sortType: 'ASC'}
      ]
    })
  }

  const handleUpdateSort = (sortName) => {
    setSearchObj({
      ...searchObj,
      sorts: sorts.map((item) => {
        if (item.sortName === sortName) {
          return {
            ...item,
            sortType: item.sortType === 'ASC' ? 'DESC' : 'ASC'
          }
        }
        return item
      })
    })
  }

  const handleDeleteSort = (sortName) => {
    setSearchObj({
      ...searchObj,
      sorts: sorts.filter((item) => item.sortName !== sortName)
    })
  }

  return (
    <div className={classes.container}
    >
      <div className={classes.row}>
        <div className={classes.statusWrapper}

        >
          <a className={classNames(classes.btnMore, !openTasks && classes.btnLess)}
            onClick={toggleStatus}
          >
            <img src={arrowDown} className={classes.arrowDown} alt='icon' />
          </a>
          {groupBy === 'ASSIGNEE'
            && <div>
              {item.user
                ? <div className={classes.userWrapper}>
                  <img src={item.user.avatar_url || defaultAvatar} className={classes.avatar} alt='avatar' />
                  <p className={classes.fullName}>
                    {item.user.fullname || item.user.username}
                  </p>
                </div>
                : <div className={classes.unassigned}>
                  Unassigned
                </div>
              }
            </div>
          }
          {groupBy === 'DUE_DATE'
            && <div className={classes.time}>
              {item.label}
            </div>
          }
          {groupBy === 'STATUS' && (!searchObj.sorts || searchObj.sorts.length === 0)
            && <div className={classes.status}
              style={{ backgroundColor: TASK_STATUS_OBJ[item.status].color}}
            >{TASK_STATUS_OBJ[item.status].label} </div>
          }

          <div className={classes.numberTask}>
            {item.tasks?.length} TASK
            <Sort sortObj={sortObj}
              sortName='taskName'
              sortIndexObj={sortIndexObj}
              handleAddSort={handleAddSort}
              handleUpdateSort={handleUpdateSort}
              handleDeleteSort={handleDeleteSort}
            />
            
          </div>
        </div>
        <div className={classNames(classes.assignee, classes.col)}>
          <span>Assignee</span>
          {/* <Sort sortObj={sortObj}
              sortName='members'
              sortIndexObj={sortIndexObj}
              handleAddSort={handleAddSort}
              handleUpdateSort={handleUpdateSort}
              handleDeleteSort={handleDeleteSort}
            /> */}
        </div>

        <div className={classNames(classes.assignee, classes.col)}>
          <span>Due date</span>
          <Sort sortObj={sortObj}
              sortName='endDate'
              sortIndexObj={sortIndexObj}
              handleAddSort={handleAddSort}
              handleUpdateSort={handleUpdateSort}
              handleDeleteSort={handleDeleteSort}
            />
        </div>

        <div className={classNames(classes.assignee, classes.col)}>
          <span>Budget</span>
          <Sort sortObj={sortObj}
              sortName='budget'
              sortIndexObj={sortIndexObj}
              handleAddSort={handleAddSort}
              handleUpdateSort={handleUpdateSort}
              handleDeleteSort={handleDeleteSort}
            />
        </div>

        <div className={classNames(classes.assignee, classes.col)}>
          <span>Spend</span>
          <Sort sortObj={sortObj}
              sortName='spend'
              sortIndexObj={sortIndexObj}
              handleAddSort={handleAddSort}
              handleUpdateSort={handleUpdateSort}
              handleDeleteSort={handleDeleteSort}
            />
        </div>

      </div>
      {item.tasks
        && <Droppable droppableId={`${item.id}-${groupIndex}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <Expand duration={300}
              open={openTasks}
            >
              <div className={classes.tasks}>
                {item.tasks.map((task, index) => (
                  <Draggable
                    key={`${task.task_id}-${index}`}
                    draggableId={`draggable-${task.task_id}-${index}`}
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
                        <TaskRow item={task} handleShowTaskForm={handleShowTaskForm} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>

            </Expand>
            {provided.placeholder}
          </div>

        )}
      </Droppable>
      }
    </div>
  )
}

export default connect(null, {
  handleShowTaskForm
})(GroupTask)
