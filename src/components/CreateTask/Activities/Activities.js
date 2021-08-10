import React from 'react'
import classes from './Activities.module.scss'
import diaryIcon from 'images/diary.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import { FormattedMessage } from 'react-intl'
import ActivityItem from './ActivityItem'
import EnterComment from './EnterComment'


const Activities = ({ activities, activitiesPageInfo,
  handleCreateActivity,
  handleEditActivity,
  handleRemoveActivity,
  handleSelectEmoji,
  userInfo
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <img src={diaryIcon} className={classes.diaryIcon} alt='diaryIcon'/>
        <p className={classes.title}>
          <FormattedMessage id='activity' defaultMessage='Activity'/>
        </p>
      </div>

      <div className={classes.bottom}>
        <img className={classes.avatar} src={userInfo.avatar_url || defaultAvatar} alt='avatar' />
        <div className={classes.inputWrapper}>
          <EnterComment handleSaveComment={handleCreateActivity}/>
        </div>
      </div>

      <div className={classes.activities}>
        { activities && activities.map((activity) => (
          <ActivityItem activity={activity} key={activity.activity_id || activity.tempId}
          handleEditActivity={handleEditActivity}
          handleDeleteComment={handleRemoveActivity}
          handleSelectEmoji={handleSelectEmoji}
          />
        )) }
      </div>
      
    </div>
  )
}

export default Activities
