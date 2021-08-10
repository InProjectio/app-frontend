import React from 'react'
import classes from './BoardHeader.module.scss'
import plusIcon from 'images/plus-black.svg'
import arrowLeftIcon from 'images/arrow-left-icon.svg'

const BoardHeader = ({ title, numberTasks, statusColor, setCollapse }) => {
  return (
    <div className={classes.container}>
      <div className={classes.status}
        style={{
          backgroundColor: statusColor || '#333333'
        }}
      />
      <div className={classes.row}>
        <p className={classes.title}>
          { title }
        </p>
        <div className={classes.numberTasks}>
          { numberTasks }
        </div>
      </div>
      <div className={classes.row}>
        <a className={classes.btnCollapse}
          title='Collapse column'
          onClick={() => setCollapse(true)}
        >
          <img src={arrowLeftIcon} className={classes.arrowLeftIcon} alt='icon'/>
        </a>

        <a className={classes.btnAdd}
          title='Create task'
        >
          <img src={plusIcon} className={classes.plusIcon} alt='icon'/>
        </a>
      </div>

    </div>
  )
}

export default BoardHeader

