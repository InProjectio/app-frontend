import React from 'react'
import classes from './NotificationItem.module.scss'
import arrowIcon from 'images/arrow.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import checkIcon from 'images/check-white.png'
import moment from 'moment'
import { TASK_STATUS_OBJ } from 'utils/constants'
import reloadIcon from 'images/reload.svg'
import classNames from 'classnames'
import Dropdown from 'components/Dropdown'
import SelectDate from 'components/CreateTask/SelectDate'
import Loader from 'react-loader-spinner'

const NotificationItem = ({ notification, handleShowTaskForm, status, handleChangeNotification,
  handleUpdateDueDate,
  loading
}) => {
  return (
    <div className={classNames(classes.container, status === 'new' && classes.new)}>
      <a className={classes.btnClear}
        onClick={() => {
          handleChangeNotification(notification.task_id, notification.cleared === 'n' ? 'y' : 'n')
        }}
      >
        <img src={ notification.cleared === 'n' ? checkIcon : reloadIcon } className={classes.checkIcon} alt='icon'/>
      </a>
      <div className={classes.content}>
      <div className={classes.top}>
        <div className={classes.folder}>
          <a className={classes.link}>
            {notification.workspaces?.workspace_name}
          </a>
          <img src={arrowIcon} className={classes.arrowIcon} alt='arrow' />
          <a className={classes.link}>
            {notification.projects?.project_name}
          </a>
          <img src={arrowIcon} className={classes.arrowIcon} alt='arrow' />
          <a className={classes.link}>
            {notification.folders?.folder_name}
          </a>
          
        </div>

        <div className={classes.row}>
          <div className={classes.status} style={{ backgroundColor: TASK_STATUS_OBJ[notification.tasks.status].color }} />
          <p className={classes.taskName}
            onClick={() => {
              handleShowTaskForm(notification.folders, notification.tasks)
            }}
          >
            {notification.tasks?.task_name}
          </p>
          <div className={classes.members}
            style={{ width: 26 + (notification.members.length - 1) * 10 }}
          >
            {notification.members.map((item, i) => (
              <img src={item.avatar_url || defaultAvatar}
                className={classes.avatar}
                alt='avatar'
                key={item.user_id}
                style={{
                  left: i * 10,
                  zIndex: 3 - i
                }}
              />
            ))}
          </div>
        </div>
      </div>
     <div className={classes.bottom}>
       <div className={classes.left}>
         <p className={classes.label}>
          Task is
         </p>
         <div className={classes.status}>
           OVERDUE
         </div>
         <Dropdown mainComponent={
          <div className={classes.row}>
            <a className={classes.dueDate}>
              { moment.unix(notification.tasks?.end_date).format('MMM DD hh:mm A') }
            </a>
            <a className={classes.reschedule}>
              Reschedule
            </a>
            { loading && <Loader type="Oval" color='#7b68ee' height={12} width={12} />}
          </div>
         }
         childrenComponent={(handleClose) => (
           <SelectDate handleClose={handleClose}
            showReminder={true}
            handleSelectDate={(date, reminder) => {
              handleUpdateDueDate({
                task_id: notification.task_id,
                end_date: date,
                reminder
              })
            }}
            currentDate={moment.unix(notification.tasks?.end_date).toDate()}
            minDate={moment.unix(notification.tasks?.start_date).format('YYYY-MM-DD HH:mm:ss')}
            currentReminder={notification.duedate_reminder}
          />
         )}
         />
         
       </div>
       <p className={classes.date}>
         { moment.unix(notification.tasks?.end_date).format('MMM DD \\at hh:mm A') }
       </p>
     </div>
     </div>
    </div>
  )
}

export default NotificationItem
