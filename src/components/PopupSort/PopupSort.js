import React from 'react'
import classes from './PopupSort.module.scss'
import Head from '../CreateTask/Head'
import { FormattedMessage } from 'react-intl'
import checkIcon from 'images/check-icon.svg'
import classNames from 'classnames'
import sortIcon from 'images/sort.svg'
import ascendingSort from 'images/ascending-sort.svg'
import upArrowIcon from 'images/up-arrow.svg'
import sweepingIcon from 'images/sweeping.svg'

const PopupSort = ({ handleClose, sort, handleChangeSort }) => {

  return (
    <div className={classes.container}>
      <Head title={<FormattedMessage id='sort' defaultMessage='Sort' />}
        handleClose={handleClose}
      />
      <div className={classes.content}>
        <div className={classes.status}
          onClick={() => {
            handleClose()
          }}
        >
          <img src={sortIcon} className={classes.sortIcon} alt='icon' />
          <p className={classNames(classes.stastusText)}>
            <FormattedMessage id='sort' defaultMessage='Sort'/>
          </p>
          {sort === 'selected' && <img src={checkIcon} className={classes.checlIcon} alt='icon' />}
        </div>

        <div className={classes.status}
          onClick={() => {
            handleClose()
          }}
        >
          <img src={ascendingSort} className={classes.icon} alt='icon' />
          <p className={classNames(classes.stastusText)}>
            <FormattedMessage id='sortAllColumn' defaultMessage='Sort entire column'/>
          </p>
          {sort === 'selected' && <img src={checkIcon} className={classes.checlIcon} alt='icon' />}
        </div>

        <div className={classes.status}
          onClick={() => {
            handleClose()
          }}
        >
          <img src={sweepingIcon} className={classes.icon} alt='icon' />
          <p className={classNames(classes.stastusText)}>
            <FormattedMessage id='sortAllColumn' defaultMessage='Clear sort'/>
          </p>
          {sort === 'selected' && <img src={checkIcon} className={classes.checlIcon} alt='icon' />}
        </div>
      </div>
    </div>
  )
}

export default PopupSort
