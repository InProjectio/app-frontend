import React from 'react'
import classes from './Context.module.scss'
import penIcon from 'images/pen.png'
import trashIcon from 'images/trash.png'
import usersIcon from 'images/users.svg'
import classNames from 'classnames'

const Context = ({handleEdit, handleDelete, handleViewMembers, handleClose}) => {
  return (
    <div className={classes.container}>
      { handleViewMembers
        && <a className={classes.viewMembers}
        onClick={(e) => {
          e.stopPropagation()
          if (handleViewMembers) {
            handleViewMembers()
          }
          handleClose()
        }}
        title='View members'
      >
        <img src={usersIcon} className={classes.usersIcon} alt='icon'/>
      </a>
      }
      { handleEdit
        && <a className={classNames(classes.edit, !handleViewMembers && classes.ml0)}
          onClick={(e) => {
            e.stopPropagation()
            if (handleEdit) {
              handleEdit()
            }
            handleClose()
          }}
          title='Edit'
        >
          <img src={penIcon} className={classes.penIcon} alt='icon'/>
        </a>
      }
      { handleDelete
        && <a className={classes.delete}
          onClick={(e) => {
            e.stopPropagation()
            if (handleDelete) {
              handleDelete()
            }
            handleClose()
            
          }}
          title='Delete'
        >
          <img src={trashIcon} className={classes.trashIcon} alt='icon'/>
        </a>
      }
      
    </div>
  )
}

export default Context
