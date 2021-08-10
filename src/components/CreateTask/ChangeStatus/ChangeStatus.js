import React, { useState } from 'react'
import classes from './ChangeStatus.module.scss'
import Head from '../Head'
import { FormattedMessage } from 'react-intl'
import checkIcon from 'images/check-icon.svg'
import classNames from 'classnames'
import { TASK_STATUS } from 'utils/constants'


const ChangeStatus = ({ handleClose, statusInput, handleChangeStatus }) => {
  const [ status, setStatus ] = useState(statusInput)

  const handleSave = () => {
    handleChangeStatus(status)
    handleClose()
  }

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='changeStatus' defaultMessage='Change status' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <p className={classes.label}>
          <FormattedMessage id='selectStatus'
            defaultMessage='Select status'
          />
        </p>

        { TASK_STATUS.map((item) => (
          <div key={item.value} className={classes.status}
            onClick={() => setStatus(item.value)}
          >
            <div className={classes.box} style={{ backgroundColor: item.color }}/>
            <p className={classNames(classes.stastusText, status === item.value && classes.textbold)}>
              { item.label }
            </p>
            { status === item.value && <img src={checkIcon} className={classes.checlIcon} alt='icon'/> }
          </div>
        )) }

        <a className={classes.btnSave}
          onClick={handleSave}
        >
          <FormattedMessage id='save' defaultMessage='Save'/>
        </a>

      </div>
    </div>
  )
}

export default ChangeStatus
