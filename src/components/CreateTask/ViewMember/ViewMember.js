import React from 'react'
import { FormattedMessage } from 'react-intl'
import closeIcon from 'images/close.svg'
import defaultAvatar from 'images/defaultAvatar.svg'
import classes from './ViewMember.module.scss'

const ViewMember = ({ member, handleClose, handleRemove }) => {
  return (
    <div className={classes.container}>
      <a className={classes.btnClose}
        onClick={handleClose}
      >
        <img src={closeIcon} className={classes.closeIcon} alt='icon'/>
      </a>
      <div className={classes.row}>
        <img src={member.avatar_url || defaultAvatar} className={classes.avatar} alt='avatar'/>
        <div className={classes.content}>
          <p className={classes.fullName}>
            { member.fullname }
          </p>
          <p className={classes.username}>
            @{ member.username }
          </p>
        </div>
      </div>
      <a className={classes.btnRemove}
        onClick={() => {
          handleRemove(member)
          handleClose()
        }}
      >
        <FormattedMessage id='ViewMember.remoteFromCard'
          defaultMessage='Remove from card'
        />
      </a>
    </div>
  )
}

export default ViewMember
