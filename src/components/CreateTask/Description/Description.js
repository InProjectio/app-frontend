import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import classes from './Description.module.scss'
import descriptionIcon from 'images/description.svg'
import { FormattedMessage } from 'react-intl'
import TextareaAutosize from 'react-textarea-autosize'
import closeIcon from 'images/close.svg'

const Description = ({
  description,
  onChange,
  disabled
}) => {
  let isCancel = false
  const inputRef = useRef(null)

  const [ focus, setFocus ] = useState(false)
  const [ text, setText ] = useState(description)

  useEffect(() => {
    if (description !== text) {
      setText(description)
    }
  }, [description])

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <img src={descriptionIcon} className={classes.descriptionIcon} alt='description' />
        <p className={classes.title}>
          <FormattedMessage id='Description'
            defaultMessage='Description'
          />
        </p>
        { description
          && <a className={classes.btnEdit}
            onClick={() => {
              inputRef.current.focus()
            }}
          >
            <FormattedMessage id='Edit'
              defaultMessage='Edit'
            />
          </a>
        }
      </div>
      <div className={classes.inputWrapper}>
        <TextareaAutosize className={classNames(classes.input, !description && classes.inputEmpty)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Add a more detailed description...'
          maxRows={focus ? 30 : 1000}
          minRows={(focus || !description) ? 3 : 1}
          ref={inputRef}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setTimeout(() => {
              setFocus(false)
              if (!isCancel) {
                onChange(text)
              } else {
                isCancel = false
              }
            }, 200)
           
          }}
          disabled={disabled}
        />
        
      </div>
      { focus
          && <div className={classes.actions}>
            <a className={classes.btnSave}
            >
              <FormattedMessage id='Save'
                defaultMessage='Save'
              />
            </a>
            <a className={classes.btnClose}
              onClick={() => {
                isCancel = true
                setText(description)
              }}
            >
              <img className={classes.closeIcon} src={closeIcon} alt='close'/>
            </a>
          </div>
        }
    </div>
  )
}

export default Description
