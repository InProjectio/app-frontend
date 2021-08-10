import React, { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import classes from './ManageTask.module.scss'
import { convertSearchParamsToObject, convertObjectToSearchParams, convertParamsFromPathname } from 'utils/utils'
import classNames from 'classnames'
import Filter from './Filter'
import ListView from './ListView'
import BoardView from './BoardView'
import CalendarView from './CalendarView'
import {connect} from 'react-redux'
import reducer, {
  getTasks,
  getTasksByCalendar,
  getTasksByBoard
} from './slices'
import { createStructuredSelector } from 'reselect'
import { useInjectReducer } from 'utils/injectReducer'
import { useInjectSaga } from 'utils/injectSaga'
import saga from './saga'
import {
  selectTasks,
  selectTaskByStatus,
  selectTasksByDueDate,
  selectTasksByCalendar,
  selectTasksByBoard,
  selectPageInfo,
  selectTasksByAssignee
} from './selectors'
import history from 'utils/history'
import EventEmitter from 'utils/EventEmitter'

let cursorTask  = null

const ManageTask = ({ showMenu, getTasks, taskByStatus, tasksByDueDate, 
  getTasksByCalendar, tasksByCalendar,
  getTasksByBoard,
  tasksByBoard,
  pageInfo,
  tasks,
  tasksByAssignee,
}) => {

  const userInfo = useMemo(() => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }, [])

  useInjectReducer({key: 'ManageTask', reducer})
  useInjectSaga({key: 'ManageTask', saga})
  const location = useLocation()
  const [searchObj, setSearchObj] = useState({
    textSearch: '',
    groupBy: 'STATUS',
    assigneeShow: '',
    members: [],
    sorts: [],
    sortAll: true,
  })

  const [calendarInfo, setCalendarInfo] = useState({
    view: {
      value: 'month',
      label: 'Month',
      type: 'M'
    },
    date: new Date(),
    startDate: moment().startOf('month').subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').add(7, 'days').format('YYYY-MM-DD')
  })

  const [show, setShow] = useState('LIST')

  const handleChangeCalendarInfo = (info) => {
    const startDate = moment(info.date).startOf('month').subtract(7, 'days').format('YYYY-MM-DD')
    const endDate = moment(info.date).endOf('month').add(7, 'days').format('YYYY-MM-DD')
    if (startDate !== info.startDate || endDate !== info.endDate) {
      setCalendarInfo({
        ...info,
        startDate,
        endDate
      })
      history.replace({
        pathname: location.pathname,
        search: convertObjectToSearchParams({
          ...searchObj,
          date: moment(info.date).format('YYYY-MM-DD'),
          startDate,
          endDate
        })
      })
    } else {
      setCalendarInfo(info)
    }
    
  }

  useEffect(() => {
    const query = convertSearchParamsToObject(location.search)
    const params = convertParamsFromPathname(location.pathname)
    if (!query.show || query.show !== show) {
      setShow(query.show || 'LIST')
    }
    if (query.date) {
      setCalendarInfo((info) => ({
        ...info,
        date: moment(query.date).toDate()
      }))
    }

    setSearchObj({
      ...query,
      ...params,
      textSearch: query.textSearch || '',
      groupBy: query.groupBy || 'STATUS',
      show: query.show || '',
      members: query.members ? query.members.split(',') : [],
      sorts: query.sorts ? query.sorts.split(',').map((item, i) => {
        const [sortName, sortType] = item.split('_')
        return {
          sortName,
          sortType,
          index: i + 1
        }
      }) : [],
    })
  }, [location.pathname, location.search])


  const handleGetData = () => {
    const query = convertSearchParamsToObject(location.search)
    const params = convertParamsFromPathname(location.pathname)
    const { show } = query
    if (!show || show === 'LIST') {
      getTasks({
        ...query,
        ...params
      })
    } else if (show === 'CALENDAR' ) {
      const startDate = query.startDate ? moment(query.startDate).unix() : moment().startOf('month').subtract(7, 'days').unix()
      const endDate = query.endDate ? moment(query.endDate).unix() : moment().endOf('month').add(7, 'days').unix()
      getTasksByCalendar({
        ...query,
        ...params,
        startDate,
        endDate
      })
    } else if (show === 'BOARD') {
      getTasksByBoard({
        ...query,
        ...params
      })
    }
    if (show) {
      setShow(show)
    }
  }

  /**
   * listen update task or create task success refresh task
   */
  useEffect(() => {
    const handleRefresh = () => {
      handleGetData()
    }
    EventEmitter.on('refreshTasks', handleRefresh)

    return () => {
      EventEmitter.remove('refreshTasks', handleRefresh)
    }
  }, [location.search, location.pathname])

  useEffect(() => {
    
    handleGetData()
  
  }, [location.pathname, location.search])

  useEffect(() => {
    const trackScrolling = () => {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom + 10 >= docHeight) {
        const count = pageInfo?.count
        const numberTasks = tasks.length
        if (count > numberTasks && cursorTask !== numberTasks) {
          cursorTask = numberTasks
          const page = Math.round(numberTasks / 20) + 1
          getTasks({
            ...searchObj,
            members: searchObj.members.join(','),
            page,
          })

          setTimeout(() => {
            cursorTask = null
          }, 1000)
        }
      }
    }
    if (show === 'LIST') {
      window.addEventListener('scroll', trackScrolling);
    }
    return () => {
      window.removeEventListener('scroll', trackScrolling);
    }
  }, [show, pageInfo?.count, tasks.length, searchObj])

  const handleSearch = (query) => {
    let members = []
    if (query.assigneeShow) {
      if (query.assigneeShow === 'ONLY_ME') {
        members = [userInfo._id]
      } else {
        members = query.members.map((item) => item._id)
      }
      
    }
    history.replace({
      pathname: location.pathname,
      search: convertObjectToSearchParams({
        show: query.show,
        textSearch: query.textSearch,
        groupBy: query.groupBy,
        members: members.join(','),
        sorts: query.sorts && query.sorts.map((item) => `${item.sortName}_${item.sortType}`).join(',')
      })
    })
  }

  return (
    <div className={classes.container}>
      {/* <div className={classes.background} /> */}
      <div className={classNames(classes.filter, showMenu === 'COLLAPSE' && classes.filterLarge)}>
        <Filter searchObj={searchObj}
          setSearchObj={handleSearch}
          show={show}
          calendarInfo={calendarInfo}
          setCalendarInfo={handleChangeCalendarInfo}
          handleSearch={handleSearch}
        />
      </div>
      <div className={classes.content}>
        { show === 'LIST'
          && <ListView searchObj={searchObj}
            tasks={taskByStatus}
            tasksByDueDate={tasksByDueDate}
            setSearchObj={handleSearch}
            tasksByAssignee={tasksByAssignee}
            normalTasks={tasks}
          />
        }
        { show === 'BOARD'
          && <BoardView tasksGroup={tasksByBoard}
            searchObj={searchObj}
            handleGetData={handleGetData}
          />
        }
        { show === 'CALENDAR'
          && <CalendarView calendarInfo={calendarInfo}
            setCalendarInfo={setCalendarInfo}
            tasks={tasksByCalendar}
          />
        }
        
      </div>
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  tasks: selectTasks(),
  taskByStatus: selectTaskByStatus(),
  tasksByDueDate: selectTasksByDueDate(),
  tasksByCalendar: selectTasksByCalendar(),
  tasksByBoard: selectTasksByBoard(),
  pageInfo: selectPageInfo(),
  tasksByAssignee: selectTasksByAssignee()
})

const mapDispatchToProps = {
  getTasks,
  getTasksByCalendar,
  getTasksByBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageTask)

