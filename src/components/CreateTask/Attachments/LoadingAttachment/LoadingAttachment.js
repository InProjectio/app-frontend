import React from 'react'
import classes from './LoadingAttachment.module.scss'
import Loader from 'react-loader-spinner';

const LoadingAttachment = () => {
  return (
    <div className={classes.container}>
      <Loader type="Bars" color="#00BFFF" height={70} width={70} />
      <p className={classes.text}>
        Processing...
      </p>
    </div>
  )
}

export default LoadingAttachment