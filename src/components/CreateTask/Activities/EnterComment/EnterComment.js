import React, { useState } from 'react'
import classNames from 'classnames'
import {FormattedMessage} from 'react-intl'
import TextareaAutosize from 'react-textarea-autosize'
import attachmentIcon from 'images/paperclip.svg'
import faceIcon from 'images/smile-plus.png'
import closeIcon from 'images/close.svg'
import classes from './EnterComment.module.scss'

const EnterComment = ({ activity, handleClose, autoFocus, handleSaveComment }) => {
  const [ focus, setFocus ] = useState(false)
  const [ error, setError ] = useState(false)
  const [ text, setText ] = useState(activity ? activity.activity_content : '')

  return (
    <div className={classNames(classes.inputWrapper, error && classes.error)}>
      <TextareaAutosize className={classes.input}
        minRows={1}
        maxRows={20}
        placeholder='Write a comment...'
        onFocus={() => setFocus(true)}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          if (!e.target.value && activity && !error) {
            setError(true)
          } else if (error) {
            setError(false)
          }
        }}
        autoFocus={autoFocus}
      />
      <div className={classNames(classes.actions, focus && classes.actionsFocus)}>
        <div className={classes.row}>
          <a className={classNames(classes.btnSave, text && classes.btnActive)}
            onClick={() => {
              handleSaveComment(text)
              setText('')
              setFocus(false)
              if (handleClose) {
                handleClose()
              }
            }}
          >
            <FormattedMessage id='save' defaultMessage='Save' />
          </a>
          <a className={classes.btnClose}
            onClick={() => {
              setFocus(false)
              if (handleClose) {
                handleClose()
              }
              
            }}
          >
            <img src={closeIcon} className={classes.closeIcon} alt='close'/>
          </a>
        </div>
        
        <div className={classes.row}>
          <a className={classes.btn}>
            <img src={attachmentIcon} className={classes.attachmentIcon} alt='icon' />
          </a>
        </div>
      </div>
    </div>
  )
}

export default EnterComment
