import React from 'react'
import classes from './Head.module.scss'
import closeIcon from 'images/close.svg'
import backIcon from 'images/arrow-left-icon.svg'

const Head = ({ title, handleClose, handleBack }) => {
  return (
    <div className={classes.container}>
      { handleBack
        && <a className={classes.btnBack}
          onClick={handleBack}
        >
          <img src={backIcon} className={classes.backIcon} alt='close-icon'/>
        </a>
      }
      
      <p className={classes.title}>
        {title}
      </p>
      <a className={classes.btnClose}
        onClick={handleClose}
      >
        <img src={closeIcon} className={classes.closeIcon} alt='close-icon'/>
      </a>
    </div>
  )
}

export default Head