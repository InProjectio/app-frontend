import React from 'react'
import classes from './Menus.module.scss'
// import Button from 'components/Button'
import avatar from 'images/avatar.jpg'
import history from 'utils/history'
import { FileURL } from 'utils/config'

const Menus = ({ profile }) => {
  return (
    <div className={classes.container}>
      <div className={classes.head}>
        <div className={classes.avatarWrapper}>
          <img src={profile.avatar ? `${FileURL}${ profile.avatar }` : avatar} className={classes.avatar} alt='avatar' />
        </div>
        <div className={classes.right}>
          <p className={classes.name}>
            { profile.fullName }
          </p>
          <p className={classes.email}>
            { profile.email }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Menus
