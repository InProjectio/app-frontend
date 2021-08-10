import React, { useRef } from 'react'
import classNames from 'classnames'
import classes from './TaskHeader.module.scss'
import { FormattedMessage } from 'react-intl'
import dividerTo from 'images/divider-to.png'
import trashIcon from 'images/trash.svg'
import moment from 'moment'
import useShowPopup from '../hooks/useShowPopup'
import SelectDate from '../SelectDate'
import EstimateTime from '../EstimateTime'
import ChangeStatus from '../ChangeStatus'
import { TASK_STATUS_OBJ } from 'utils/constants'
import Dropdown from 'components/Dropdown'
import PopupConfirm from '../Checklist/PopupConfirm'
import SavingLoading from 'components/SideBar/CreateSpace/SavingLoading'

const TaskHeader = ({
  startDate,
  handleChangeStartDate,
  dueDate,
  handleChangeDueDate,
  estimateTime,
  handleChangeEstimateTime,
  status,
  handleChangeStatus,
  isEdit,
  handleDeleteTask,
  loading,
  create_at,
  reminder
}) => {
  const startDateRef = useRef(null)
  const dueDateRef = useRef(null)
  const estimateTimeRef = useRef(null)
  const statusRef = useRef(null)

  const [ showSelectStartDate, setShowSelectStartDate ] = useShowPopup(startDateRef)
  const [ showSelectDueDate, setShowSelectDueDate ] = useShowPopup(dueDateRef)
  const [ showEstimateTime, setShowEstimateTime ] = useShowPopup(estimateTimeRef)
  const [ showChangeStatus, setShowChangeStatus ] = useShowPopup(statusRef)

  return (
    <div className={classes.container}>
      { isEdit
        && <>
          <div className={classes.col}>
            <div>
              <p className={classes.label}>
                <FormattedMessage id='created'
                  defaultMessage='Created'
                />
              </p>
              <p className={classes.value}>
                {moment(create_at).format('DD/MM/YYYY hh:mm A')}
              </p>
            </div>
            
          </div>
          <div className={classes.divider} />
        </>
      }
      
      <div className={classNames(classes.col, classes.relative)}
        ref={estimateTimeRef}
      >
        <div onClick={() => setShowEstimateTime(true)}
        >
          <p className={classes.label}>
            <FormattedMessage id='estimate'
              defaultMessage='Estimate'
            />
          </p>
          <p className={classes.value}>
            {estimateTime}h
          </p>
        </div>

        { showEstimateTime
          && <div className={classes.popup}>
            <EstimateTime handleClose={() => setShowEstimateTime(false)}
              handleChangeEstimateTime={handleChangeEstimateTime}
              estimateTime={estimateTime}
            />
          </div>
        }
      </div>
      <div className={classes.divider} />
      <div className={classNames(classes.col, classes.relative)}
        ref={startDateRef}
      >
        <div onClick={() => setShowSelectStartDate(true)}
        >
          <p className={classes.label}>
            <FormattedMessage id='startDate'
              defaultMessage='Start date'
            />
          </p>
          <p className={classes.value}>
            { startDate ? moment(startDate).format('DD/MM/YYYY hh:mm A') : 'Select date'  }
          </p>
        </div>

        { showSelectStartDate
          && <div className={classes.popup}>
            <SelectDate handleClose={() => setShowSelectStartDate(false)}
              handleSelectDate={(date) => handleChangeStartDate(date)}
              currentDate={startDate && moment(startDate).toDate()}
              // minDate={moment().format('YYYY-MM-DD HH:mm:ss')}
              maxDate={moment(dueDate).format('YYYY-MM-DD HH:mm:ss')}
              
            />
          </div>
        }
       
      </div>
      <img src={dividerTo} className={classes.dividerTo} alt='icon'/>
      <div className={classNames(classes.col, classes.relative)}
        ref={dueDateRef}
      >
        <div onClick={() => setShowSelectDueDate(true)}>
          <p className={classes.label}>
            <FormattedMessage id='dueDate'
              defaultMessage='Due date'
            />
          </p>
          <p className={classes.value}>
            { moment(dueDate).format('DD/MM/YYYY hh:mm A')  } 
          </p>
        </div>

        { showSelectDueDate
          && <div className={classes.popup}>
            <SelectDate handleClose={() => setShowSelectDueDate(false)}
              showReminder={true}
              handleSelectDate={(date, reminder) => handleChangeDueDate(date, reminder)}
              currentDate={dueDate && moment(dueDate).toDate()}
              minDate={moment(startDate).format('YYYY-MM-DD HH:mm:ss')}
              currentReminder={reminder}
            />
          </div>
        }
      </div>
      { isEdit
        && <div className={classNames(classes.colLarge, classes.bl)}>
          <div>{ loading > 0 && <SavingLoading /> } </div>
          <div className={classes.rowend}>
            <div className={classes.relative}
              ref={statusRef}
            >
              <div className={classes.status}
                style={{
                  backgroundColor: TASK_STATUS_OBJ[status]?.color 
                }}
                onClick={() => setShowChangeStatus(true)}
              >
                { TASK_STATUS_OBJ[status]?.label }
              </div>
              { showChangeStatus
              && <div className={classes.popup}>
                  <ChangeStatus handleClose={() => setShowChangeStatus(false)}
                    statusInput={status}
                    handleChangeStatus={handleChangeStatus}
                  />
                </div>
              }
            </div>

            <Dropdown mainComponent={
              <a className={classes.btnDelte}>
                <img src={trashIcon} className={classes.trashIcon} alt='trashIcon'/>
              </a>
            }
            childrenComponent={(handleClose) => (
              <PopupConfirm title={<FormattedMessage id='deleteTask'
                    defaultMessage='Delete task'
                  />}
                  message={<FormattedMessage id='deleteTask.message'
                    defaultMessage='Do you want to delete this task?'
                  />}
                  btnText={
                    <FormattedMessage id='deleteTask.btn'
                    defaultMessage='Delete task'
                  />
                  }
                  handleClose={handleClose}
                  handleClick={() => handleDeleteTask()}
                  
                  />
            )}
            />
          </div>
        
        
      </div>
      }
      
    </div>
  )
}

export default TaskHeader
