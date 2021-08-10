import React, { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import classes from './Header.module.scss'
import cardIcon from 'images/credit-card.svg'
// import viewIcon from 'images/view.svg'
// import searchIcon from 'images/search-black.svg'
import { FormattedMessage } from 'react-intl'
import Dropdown from 'components/Dropdown'
import SelectFolder from '../SelectFolder'

const Header = ({ title, selectedPhase, handleChangePhase, error, handleSaveTitle, isEdit }) => {
  const [text, setText] = useState(title || '')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isEdit) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (title !== text) {
      setText(title)
    }
  }, [title])

  return (
    <div className={classes.container}>
      <img src={cardIcon} className={classes.cardIcon} alt='card-icon'/>
      <div className={classes.content}>
        <textarea className={classNames(classes.input, error && !text && classes.errorInput)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Enter task name'
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation()
              inputRef.current.blur()
            }
           
          }}
          onBlur={() => {
            handleSaveTitle(text)
          }}
        />
        <div className={classes.row}>
          <div className={classes.text}>
            <FormattedMessage id='createTask.inlist'
              defaultMessage='In'
            />
            <Dropdown mainComponent={
              <div className={classNames(classes.inputWrapper, error && !selectedPhase?.folder_id && classes.error)}>
                <div className={classes.inlist}>
                  { selectedPhase?.folder_name }
                </div>
              </div>
              
            }
              childrenComponent={(handleClose) => <SelectFolder handleClose={handleClose}
                handleChangePhase={handleChangePhase}
              />}
            />
            
            {/* <img src={viewIcon} className={classes.viewIcon} alt='view-icon'/> */}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Header
