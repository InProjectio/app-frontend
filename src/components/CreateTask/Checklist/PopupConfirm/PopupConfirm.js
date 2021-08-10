import React from 'react'
import classes from './PopupConfirm.module.scss'
import Head from 'components/CreateTask/Head'

const PopupConfirm = ({ handleClick, title, message, btnText, handleClose }) => {
  return (
    <div className={classes.container}>
      <Head title={title}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <p className={classes.message}>
          { message }
        </p>
        <a className={classes.btn}
          onClick={handleClick}
        >
          { btnText }
        </a>
      </div>
      
    </div>
  )
}

export default PopupConfirm
