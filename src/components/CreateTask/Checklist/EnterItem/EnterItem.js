import React, { useState } from 'react'
import closeIcon from 'images/close.svg'
import TextareaAutosize from 'react-textarea-autosize'
import { FormattedMessage } from 'react-intl'
import clock from 'images/clock.svg'
import addUser from 'images/add-user.svg'
import classNames from 'classnames'
import classes from './EnterItem.module.scss'
import SelectDate from '../../SelectDate'
import SelectMembers from '../../SelectMembers'
import Dropdown from 'components/Dropdown'
import moment from 'moment'

const EnterItem = ({ item,
  handleSaveItem,
  moreAction,
  handleClose,
  projectId,
  handleUpdateItem
}) => {
  let isCancel = false
  const [text, setText] = useState(item ? item.title : '')

  const handleSave = () => {
    if (item) {
      handleSaveItem({ ...item, title: text })
    } else {
      handleSaveItem({ title: text, id: new Date().valueOf() })
    }
    handleClose()
  }

  return (
    <div className={classes.container}>
      <TextareaAutosize className={classes.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Add an item'
        maxRows={20}
        minRows={3}
        // onBlur={handleBlur}
        autoFocus={true}
      />
      <div className={classes.rowBetween}>
        <div className={classes.row}>
          <a className={classNames(classes.btn, classes.btnSave)}
            onClick={handleSave}
          >
            <FormattedMessage id='Save'
              defaultMessage='Save'
            />
          </a>
          <a className={classes.btnClose}
            onClick={() => {
              console.log('test ===>')
              isCancel = true
              handleClose()
            }}
          >
            <img className={classes.closeIcon} src={closeIcon} alt='close' />
          </a>
        </div>
        {moreAction && item && item?.id
          && <div className={classes.row}>
            <Dropdown mainComponent={
              <a className={classes.btn}>
                <img src={addUser} className={classes.addUser} alt='clock' />
                <FormattedMessage id='assign'
                  defaultMessage='Assign'
                />
              </a>
            }
              childrenComponent={(handleClose) => (
                <div className={classes.wrapper}>
                  <SelectMembers selectedMembers={item.members}
                    setSelectedMembers={(members, isAdd, listMembers) => {
                      if (isAdd) {
                        handleUpdateItem({members, addMember: listMembers[0]})
                      } else {
                        handleUpdateItem({members, removeMember: listMembers[0]})
                      }
                    }}
                    handleClose={handleClose}
                    projectId={projectId}
                  />
                </div>
              )}
            />
            <Dropdown mainComponent={
              <a className={classes.btn}>
                <img src={clock} className={classes.clock} alt='clock' />
                <FormattedMessage id='dueDate'
                  defaultMessage='Due date'
                />
              </a>
            }
            childrenComponent={(handleCloseDate) => (
                <SelectDate handleClose={handleCloseDate}
                  handleSelectDate={(date) => {
                    handleClose()
                    handleUpdateItem({ end_date: moment(date).unix() })
                  }}
                  currentDate={moment.unix(item?.end_date).toDate()}
                />
            )}
            />

          </div>
        }

      </div>
    </div>
  )
}

export default EnterItem
