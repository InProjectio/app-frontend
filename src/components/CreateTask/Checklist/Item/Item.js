import React, { useRef } from 'react'
import check from 'images/check.svg'
import checked from 'images/checked.svg'
import clock from 'images/clock.svg'
import addUser from 'images/add-user.svg'
import trash from 'images/trash.svg'
import classNames from 'classnames'
import classes from './Item.module.scss'
import EnterItem from '../EnterItem'
import useShowPopup from 'components/CreateTask/hooks/useShowPopup'
import Dropdown from 'components/Dropdown'
import PopupConfirm from '../PopupConfirm'
import { FormattedMessage } from 'react-intl'
import SelectDate from '../../SelectDate'
import SelectMembers from '../../SelectMembers'
import moment from 'moment'
import defaultAvatar from 'images/defaultAvatar.svg'

const Item = ({ item, handleUpdateItem, handleDeleteItem, projectId }) => {
  const itemRef = useRef(null)
  const [focus, setFocus] = useShowPopup(false)

  return (
    <div className={classes.container}
      ref={itemRef}
    >
      <div className={classes.checkWrapper}
        onClick={() => handleUpdateItem({ ...item, completed: item.completed === 'y' ? 'n' : 'y' })}
      >
        <img src={item.completed === 'y' ? checked : check}
          className={classNames(classes.icon, item.completed === 'y' && classes.iconSelected)}
          alt='icon'
        />
      </div>
      <div className={classes.content}>
        {focus
          ? <div>
            <EnterItem item={{ ...item, title: item.item_name }}
              handleSaveItem={({ title }) => handleUpdateItem({ ...item, item_name: title })}
              moreAction={true}
              handleClose={() => { setFocus(false) }}
              handleUpdateItem={(values) => handleUpdateItem({ ...item, ...values })}
              projectId={projectId}

            />
          </div>
          : <div className={classes.row}

          >
            <p className={classNames(classes.text, item.completed === 'y' && classes.textDone)}
              onClick={() => setFocus(true)}
            >
              {item.item_name}
            </p>
            <div className={classes.actions}>
              <Dropdown mainComponent={
                <a className={classNames(classes.btnSmall, classes.btnClock, item.end_date && classes.show)}
                >
                  <img src={clock} className={classes.clock} alt='clock' />
                  {item.end_date && <span>{moment.unix(item.end_date).format('MMM DD, HH:mm')}</span>}
                </a>
              }
                childrenComponent={(handleClose) => (
                  <SelectDate handleClose={handleClose}
                    handleSelectDate={(date) => handleUpdateItem({ ...item, end_date: moment(date).unix() })}
                    currentDate={item.end_date && moment.unix(item.end_date).toDate()}
                  />
                )}
              />

              <Dropdown mainComponent={
                <div className={classNames(classes.btnSmall,
                  classes.btnAddUser,
                  item.members && item.members.length > 0 && classes.show,
                  item.members && item.members.length > 0 && classes.noBackground)}
                >
                  {(item.members && item.members.length > 0)
                    ? <div className={classes.members}
                      style={{ width: 24 + (item.members.length - 1) * 10 }}
                    >
                      {item.members.map((item, i) => (
                        <img src={item.avatar_url || defaultAvatar}
                          className={classes.avatar}
                          alt='avatar'
                          key={item.user_id || i}
                          style={{
                            left: i * 10,
                            zIndex: 3 - i
                          }}
                        />
                      ))}
                    </div>
                    : <img src={addUser} className={classes.addUser} alt='clock' />
                  }
                  
                </div>
              }
                childrenComponent={(handleClose) => (
                  <div className={classes.wrapper}>
                    <SelectMembers selectedMembers={item.members}
                      setSelectedMembers={(members, isAdd, listMembers) => {
                        if (isAdd) {
                          handleUpdateItem({ ...item, members: members, addMember: listMembers[0] })
                        } else {
                          handleUpdateItem({ ...item, members: members, removeMember: listMembers[0] })
                        }
                      }}
                      handleClose={handleClose}
                      projectId={projectId}
                      hideSelectAll={true}
                    />
                  </div>
                )}
              />


              <Dropdown mainComponent={
                <a className={classNames(classes.btnSmall, classes.btnDelete)}
                >
                  <img src={trash} className={classes.trash} alt='clock' />
                </a>
              }
                childrenComponent={(handleClose) => (
                  <PopupConfirm title={<FormattedMessage id='checklistItem.delete'
                    defaultMessage='Delete item?'
                  />}
                    message={<FormattedMessage id='checklistItem.deleteMessage'
                      defaultMessage='Do you want to delete item?'
                    />}
                    btnText={
                      <FormattedMessage id='checklistItem.deleteItem'
                        defaultMessage='Delete item'
                      />
                    }
                    handleClose={handleClose}
                    handleClick={() => handleDeleteItem(item)}

                  />
                )}
              />

            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Item
