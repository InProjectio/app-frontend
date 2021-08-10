import React, { useState, useRef, useEffect, useMemo } from 'react'
import moment from 'moment'
import classes from './Filter.module.scss'
import searchIcon from 'images/search-black.svg'
import layerIcon from 'images/layer.svg'
import userIcon from 'images/user.svg'
import usersIcon from 'images/users.svg'
import userWhiteIcon from 'images/user-white.svg'
import usersWhiteIcon from 'images/users-white.svg'
import caretIcon from 'images/caret-down.svg'
import arrowIcon from 'images/arrow.svg'
import { FormattedMessage } from 'react-intl'
import SelectMembers from 'components/CreateTask/SelectMembers'
import useShowPopup from 'components/CreateTask/hooks/useShowPopup'
import classNames from 'classnames'
import GroupBy from 'components/GroupBy'
import closeIcon from 'images/close.svg'
import { GROUP_BY_OBJ } from 'utils/constants'
import Dropdown from 'components/Dropdown'
import TimePeriod from './TimePeriod'

let timeout = null

const Filter = ({ searchObj, setSearchObj, show,
  calendarInfo,
  setCalendarInfo
}) => {
  
  const assignEveryOneRef = useRef(null)
  const groupByRef = useRef(null)

  const [text, setText] = useState(searchObj.textSearch)
  const [showSelectMembers, setShowSelectMembers] = useShowPopup(assignEveryOneRef)
  const [showGroupBy, setShowGroupBy] = useShowPopup(groupByRef)

  useEffect(() => {
    if (searchObj.textSearch !== text) {
      setText(searchObj.textSearch)
    }
  }, [searchObj.textSearch])

  const handelChangeText = (e) => {
    let value = e.target.value
    setText(value)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      setSearchObj({
        ...searchObj,
        textSearch: value
      })
    }, 300);
  }

  const handleChangeCalendarInfo = (values) => {
    setCalendarInfo({
      ...calendarInfo,
      ...values
    })
  }

  const numberMembers = searchObj.members.length

  const view = calendarInfo.view.value

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div className={classes.inputWrapper}>
          <img src={searchIcon} className={classes.searchIcon} alt='icon' />
          <input className={classes.input}
            value={text}
            onChange={handelChangeText}
            placeholder='Search by task name...'
          />
        </div>

        { show === 'CALENDAR'
          && <div className={classes.row}>
            <a className={classes.today}
              onClick={() => {
                handleChangeCalendarInfo({ date: new Date() })
              }}
            >
              Today
            </a>
            <a className={classes.back}
              onClick={() => {
                let prevDate = moment(calendarInfo.date).add(-1, 'month')
                if (view === 'day') {
                  prevDate = moment(calendarInfo.date).add(-1, 'day')
                } else if (view === 'week') {
                  prevDate = moment(calendarInfo.date).add(-1, 'week')
                }
                
                handleChangeCalendarInfo({ date: prevDate.toDate() })
              }}
            >
              <img src={arrowIcon} className={classes.arrowIcon} alt='icon'/>
            </a>
            <a className={classes.next}
              onClick={() => {
                let nextDate = moment(calendarInfo.date).add(1, 'month')
                if (view === 'day') {
                  nextDate = moment(calendarInfo.date).add(1, 'day')
                } else if (view === 'week') {
                  nextDate = moment(calendarInfo.date).add(1, 'week')
                }
                handleChangeCalendarInfo({ date: nextDate.toDate() })
              }}
            >
              <img src={arrowIcon} className={classes.arrowIcon} alt='icon'/>
            </a>
            <p className={classes.date}>
              { view === 'day' && moment(calendarInfo.date).format('dddd, MMM DD') }
              { view === 'month' && moment(calendarInfo.date).format('MMM YYYY') }
              { view === 'week' && `${moment(calendarInfo.date).add(-6, 'days').format('MMM DD')} - ${moment(calendarInfo.date).format('MMM DD')}` }
            </p>
          </div>
        }

      </div>

      <div className={classes.right}>
        {show !== 'CALENDAR'
          && <div className={classes.relative}
            ref={groupByRef}
          >
            <div className={classes.group}
              onClick={() => setShowGroupBy(true)}
            >
              <img className={classes.layerIcon}
                src={layerIcon}
                alt='icon'
              />
              <span>
                <FormattedMessage id='groupBy'
                  defaultMessage='Group by: {groupBy}'
                  values={{
                    groupBy: GROUP_BY_OBJ[searchObj.groupBy]
                  }}
                />
              </span>

            </div>
            {showGroupBy
              && <div className={classes.popup}>
                <GroupBy groupBy={searchObj.groupBy}
                  handleChangeGroupBy={(groupBy) => setSearchObj({ ...searchObj, groupBy })}
                  handleClose={() => setShowGroupBy(false)}
                />
              </div>
            }

          </div>
        }

        {show === 'CALENDAR'
          && <div className={classes.calendar}>
            <Dropdown mainComponent={
              <div className={classes.select}>
                { calendarInfo.view.label }
                <img src={caretIcon} className={classes.caretIcon} alt='caretIcon'/>
              </div>
            }
              childrenComponent={(handleClose) => (
                <TimePeriod handleClose={handleClose}
                  handleChangePeriod={(view) => handleChangeCalendarInfo({ view })}
                />
              )}
            />
          </div>
        }

        <div className={classNames(classes.assign, searchObj.assigneeShow && classes.showAssign)}>
          <div className={classNames(classes.assignMe, searchObj.assigneeShow === 'ONLY_ME' && classes.assignActive)}
            title='Only show task assign to me'
            onClick={() => { setSearchObj({ ...searchObj, assigneeShow: 'ONLY_ME', members: [] }) }}
          >
            <img src={searchObj.assigneeShow === 'ONLY_ME' ? userWhiteIcon : userIcon} className={classes.userIcon} alt='icon' />
            <FormattedMessage id='me'
              defaultMessage='Me'
            />
            <a className={classes.btnClose}
              onClick={(e) => {
                e.stopPropagation()
                setSearchObj({ ...searchObj, assigneeShow: '' })
              }}
            >
              <img src={closeIcon} className={classes.closeIcon} alt='closeIcon' />
            </a>
          </div>
          <div className={classes.dot} />
          <div className={classes.relative}
            ref={assignEveryOneRef}
          >
            <div className={classNames(classes.assignEveryOne,
              (showSelectMembers || numberMembers > 0) && searchObj.assigneeShow === 'EVERY' && classes.assignActive )}
              title='Every one'
              onClick={() => {
                setShowSelectMembers(true)
                setSearchObj({ ...searchObj, assigneeShow: 'EVERY' })
              }}
            >
              <img src={(searchObj.assigneeShow === 'EVERY' && (showSelectMembers || numberMembers > 0)) ? usersWhiteIcon : usersIcon}
                className={classes.usersIcon}
                alt='icon'
              />
              {searchObj.assigneeShow === 'EVERY' && searchObj.members && numberMembers > 0
                && <div className={classes.members}
                  style={{ width: 20 + (numberMembers - 1) * 8 }}
                >
                  {searchObj.members.map((item, i) => (
                    <img src={item.avatar}
                      className={classes.avatar}
                      alt='avatar'
                      key={item.id}
                      style={{
                        left: i * 8,
                        zIndex: 3 - i
                      }}
                    />
                  ))}
                </div>
              }
              <a className={classes.btnClose}
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchObj({ ...searchObj, assigneeShow: '', members: [] })
                  setShowSelectMembers(false)
                }}
              >
                <img src={closeIcon} className={classes.closeIcon} alt='closeIcon' />
              </a>

            </div>
            {showSelectMembers
              && <div className={classes.popup}>
                <SelectMembers selectedMembers={searchObj.members}
                  handleClose={() => setShowSelectMembers(false)}
                  setSelectedMembers={(members) => setSearchObj({ ...searchObj, members })}
                />
              </div>
            }

          </div>

        </div>

      </div>
    </div>
  )
}

export default Filter
