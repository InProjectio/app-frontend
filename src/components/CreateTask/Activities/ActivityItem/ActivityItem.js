import React, { useRef, useState } from 'react'
import moment from 'moment'
import smilePlus from 'images/smile-plus.png'
import { FormattedMessage } from 'react-intl'
import classes from './ActivityItem.module.scss'
import useShowPopup from 'components/CreateTask/hooks/useShowPopup'
import PopupConfirm from 'components/CreateTask/Checklist/PopupConfirm'
import EnterComment from '../EnterComment'
import defaultAvatar from 'images/defaultAvatar.svg'
import Dropdown from 'components/Dropdown'
import { Picker } from 'emoji-mart'
import {Emoji} from 'emoji-mart'
import classNames from 'classnames'

const ActivityItem = ({ activity,
  handleDeleteComment,
  handleEditActivity,
  handleSelectEmoji
}) => {
  const deleteRef = useRef(null)
  const [ showConfirmPopup, setShowConfirmPopup ] = useShowPopup(deleteRef)

  const [ showEdit, setShowEdit ] = useState(false)

  return (
    <div className={classes.container}>
      {activity.type === 'SYSTEM'
        && <div className={classes.row}>
          <img src={activity.userId?.avatar_url || defaultAvatar} alt='avatar' className={classes.avatar} />
          <div className={classes.info}>
            <p className={classes.name}>
              {activity.userId?.username} <span className={classes.action}>
                {activity.activity_content}
              </span>
            </p>
            <p className={classes.time}>
              {moment(activity.create_at).fromNow()}
            </p>
          </div>

        </div>
      }

      {activity.type === 'COMMENT'
        && <div className={classes.row}>
          <img src={activity.userId?.avatar_url || defaultAvatar} alt='avatar' className={classes.avatar} />
          <div className={classes.info}>
            <div className={classes.rowCenter}>
              <p className={classes.name}>
                {activity.userId?.username || activity.userId?.fullname}
              </p>
              <p className={classes.time}>
                {moment(activity.create_at).fromNow()}
              </p>
            </div>
            { showEdit ?
              <div className={classes.enterComment}>
                <EnterComment activity={activity}
                  handleClose={() => { setShowEdit(false) }}
                  autoFocus={true}
                  handleSaveComment={(activity_content) => {
                    handleEditActivity({
                      ...activity,
                      activity_content
                    })
                  }}
                />
              </div>
              : <div className={classNames(classes.message, activity.deleted === 'y' && classes.deleted)}>
                {activity.activity_content}
              </div>
            }
            { !showEdit && activity.activity_id
              && <div className={classes.actions}>
                { activity.emojies.map((emoji, i) => (
                  <React.Fragment key={i}>
                    { emoji.users && emoji.users.length > 0
                      && <div className={classes.emoji}
                        onClick={() => handleSelectEmoji(emoji.emoji, activity)}
                      >
                        <span dangerouslySetInnerHTML={{
                          __html: Emoji({
                            html: true,
                            set: 'apple',
                            emoji: emoji.emoji,
                            size: 16,
                          })
                        }}></span>
                        {emoji.users.length }
                      </div>
                    }
                    
                  </React.Fragment>
                  
                )) }

                
                <Dropdown mainComponent={
                  <div>
                    <a className={classes.btnIcon}>
                      <img src={smilePlus} className={classes.icon} alt='icon' />
                    </a>
                  </div>
                  
                }
                childrenComponent={() => (
                  <Picker set='apple'
                    onSelect={(emoji) => {
                      console.log('emoji ===> ', emoji)
                      handleSelectEmoji(emoji.colons, activity)
                    }}
                  />
                )}
                />
               -
              <div className={classes.deleteWrapper}
                ref={deleteRef}
              >
                <a className={classes.btn}
                  onClick={() => setShowConfirmPopup(true)}
                >
                  <FormattedMessage id='delete' defaultMessage='Delete' />
                </a>
                {showConfirmPopup
                  && <div className={classes.popup}>
                    <PopupConfirm title={<FormattedMessage id='deleteComment.title'
                      defaultMessage='Delete comment?'
                    />}
                      message={<FormattedMessage id='deleteComment.message'
                        defaultMessage='Deleting a comment is forever. There is no undo.'
                      />}
                      btnText={
                        <FormattedMessage id='deleteComment.btn'
                          defaultMessage='Delete comment'
                        />
                      }
                      handleClose={() => setShowConfirmPopup(false)}
                      handleClick={() => handleDeleteComment(activity.activity_id)}

                    />
                  </div>
                }
              </div>
            </div>
            }
            
          </div>
        </div>
      }
    </div>
  )
}

export default ActivityItem
