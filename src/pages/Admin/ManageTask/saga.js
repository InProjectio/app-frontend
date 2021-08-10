import {
  call,
  put,
  takeLatest,
  select
} from 'redux-saga/effects'
import {
  GET_TASKS,
  getTasksSuccess,
  GET_TASKS_BY_CALENDAR,
  getTasksByCalendarSuccess,
  GET_TASKS_BY_BOARD,
  getTasksByBoardSuccess,
  LOAD_MORE_TASKS_BY_BOARD,
  loadMoreTasksByBoardSuccess
} from './slices'
import * as Api from 'api/api'
import moment from 'moment'
import { selectTasks, selectTasksByBoard } from './selectors'

function* getTasks({ query }) {
  try {
    const oldTasks = yield select(selectTasks()) || []
    let taskByStatus = []
    let tasksByDueDate = []
    let tasksByAssignee = []
    let result = null
    if (query.groupBy === 'ASSIGNEE') {
      result = yield call(Api.get, {
        url: '/task/find-tasks-assignee',
        params: query
      })
    } else {
      result = yield call(Api.get, {
        url: '/task/find-tasks',
        params: query
      })
    }

    const docs = query.page > 1 ? [...oldTasks, ...result.data.docs] : result.data.docs
    
    if ((!query.groupBy || query.groupBy === 'STATUS') && docs && docs.length > 0) {
      let phase = null
      let status = ''
      let tasks = []
      let groupTasks = []
      docs.forEach((item) => {
        if (phase === null) {
          status = item.status
          tasks.push(item)
          phase = item.phase
        } else if (item.phase.folder_id !== phase.folder_id) {
          groupTasks.push({
            status,
            tasks,
            id: `${status}`
          })
          taskByStatus.push({
            phase,
            groupTasks
          })
          phase = item.phase
          status = item.status
          tasks = [item]
          groupTasks = []
        } else {
          if (item.status === status) {
            tasks.push(item)
          } else {
            groupTasks.push({
              status,
              tasks,
              id: `${status}`
            })
            status = item.status
            tasks = [item]
          }
        }
      });
      groupTasks.push({
        status,
        tasks,
        id: phase ? `${status}` : 0
      })
      taskByStatus.push({
        phase,
        groupTasks
      })
      // console.log('taskByStatus====>', taskByStatus)
    } else if (docs && docs.length > 0 && query.groupBy === 'DUE_DATE') {
      let currentDate = moment().format('YYYY-MM-DD')
      let overdue = {
        label: 'Overdue',
        tasks: [],
        id: 'overdue'
      }
      let today = {
        label: 'Today',
        tasks: [],
        id: 'today'
      }
      let tomorrow = {
        label: 'Tomorrow',
        tasks: [],
        id: 'tomorrow'
      }
      let day2 = {
        label: moment().add(2, 'days').format('dddd'),
        tasks: [],
        id: 'day2'
      }
      let day3 = {
        label: moment().add(3, 'days').format('dddd'),
        tasks: [],
        id: 'day3'
      }
      let day4 = {
        label: moment().add(4, 'days').format('dddd'),
        tasks: [],
        id: 'day4'
      }
      let day5 = {
        label: moment().add(5, 'days').format('dddd'),
        tasks: [],
        id: 'day5'
      }
      let day6 = {
        label: moment().add(6, 'days').format('dddd'),
        tasks: [],
        id: 'day6'
      }
      let future = {
        label: 'Future',
        tasks: [],
        id: 'future'
      }
      let done = {
        label: 'Done',
        tasks: [],
        id: 'done'
      }
      let noDueDate = {
        label: 'No Due Date',
        tasks: [],
        id: 'no_due_date'
      }

      docs.forEach((item) => {
        const dueDate = item.end_date ? moment.unix(item.end_date).format('YYYY-MM-DD') : ''
        if (item.status === 'complete') {
          done.tasks.push(item)
        } else if (!dueDate) {
          noDueDate.tasks.push(item)
        } else if (dueDate === currentDate) {
          today.tasks.push(item)
        } else if (dueDate < currentDate) {
          overdue.tasks.push(item)
        } else if (moment.unix(item.end_date).add(-1, 'days').format('YYYY-MM-DD') === currentDate) {
          tomorrow.tasks.push(item)
        } else if (moment.unix(item.end_date).add(-2, 'days').format('YYYY-MM-DD') === currentDate) {
          day2.tasks.push(item)
        } else if (moment.unix(item.end_date).add(-3, 'days').format('YYYY-MM-DD') === currentDate) {
          day3.tasks.push(item)
        } else if (moment.unix(item.end_date).add(-4, 'days').format('YYYY-MM-DD') === currentDate) {
          day4.tasks.push(item)
        } else if (moment.unix(item.end_date).add(-5, 'days').format('YYYY-MM-DD') === currentDate) {
          day5.tasks.push(item)
        } else if (moment.unix(item.end_date).add(-6, 'days').format('YYYY-MM-DD') === currentDate) {
          day6.tasks.push(item)
        } else {
          future.tasks.push(item)
        }
      })

      if (overdue.tasks && overdue.tasks.length > 0) {
        tasksByDueDate.push(overdue)
      }
      if (today.tasks && today.tasks.length > 0) {
        tasksByDueDate.push(today)
      }
      if (tomorrow.tasks && tomorrow.tasks.length > 0) {
        tasksByDueDate.push(tomorrow)
      }
      if (day2.tasks && day2.tasks.length > 0) {
        tasksByDueDate.push(day2)
      }
      if (day3.tasks && day3.tasks.length > 0) {
        tasksByDueDate.push(day3)
      }
      if (day4.tasks && day4.tasks.length > 0) {
        tasksByDueDate.push(day4)
      }
      if (day5.tasks && day5.tasks.length > 0) {
        tasksByDueDate.push(day5)
      }
      if (day6.tasks && day6.tasks.length > 0) {
        tasksByDueDate.push(day6)
      }
      if (future.tasks && future.tasks.length > 0) {
        tasksByDueDate.push(future)
      }
      if (done.tasks && done.tasks.length > 0) {
        tasksByDueDate.push(done)
      }
      // if (noDueDate.tasks && noDueDate.tasks.length > 0) {
      //   tasksByDueDate.push(noDueDate)
      // }
      

    } else if (query.groupBy === 'ASSIGNEE' && docs && docs.length > 0) {
      let currentUser = {}
      let tasks = []

      docs.forEach((item, i) => {
        if (i === 0) {
          currentUser = item.currentUser
          tasks = [{
            ...(item.currentUser ? item.tasks : item),
            users: item.members,
            phase: item.folders
          }]
        } else if (currentUser?.user_id === item.currentUser?.user_id) {
          tasks.push({
            ...(item.currentUser ? item.tasks : item),
            users: item.members,
            phase: item.folders
          })
        } else {
          tasksByAssignee.push({
            id: currentUser._id,
            user: currentUser,
            tasks: tasks
          })
          currentUser = item.currentUser
          tasks = [{
            ...(item.currentUser ? item.tasks : item),
            users: item.members,
            phase: item.folders
          }]
        }
      })
      tasksByAssignee.push({
        id: currentUser ? currentUser._id : `unassign`,
        user: currentUser,
        tasks: tasks
      })

    }

    yield put(getTasksSuccess({ data: {docs: docs, pageInfo: result.data.pageInfo}, taskByStatus, tasksByDueDate, tasksByAssignee }))
  } catch (e) {
    console.log(e)
  }
}


function* getTasksByCalendar({ query }) {
  try {
    const result = yield call(Api.get, {
      url: '/task/find-tasks-calendar',
      params: query
    })
    const tasks = result.data.map((item) => ({
      ...item,
      title: item.task_name,
      start: moment.unix(item.start_date).toDate(),
      end: moment.unix(item.end_date).toDate()
    }))
    yield put(getTasksByCalendarSuccess(tasks))
  } catch(e) {
    console.log(e)
  }
}

function* getTasksByBoard({ query }) {
  try {
    const result = yield call(Api.get,{
      url: '/task/find-tasks-board',
      params: query
    })
    const tasks = result.data

    yield put(getTasksByBoardSuccess(tasks))
  } catch(e) {
    console.log(e)
  }
}

function* loadMoreTasksByBoard({ index, docs }) {
  try {
    const tasksByBoard = yield select(selectTasksByBoard())

    const newTasksByBoard = tasksByBoard.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          tasks: [...item.tasks, ...docs]
        }
      }
      return item
    })

    yield put(loadMoreTasksByBoardSuccess(newTasksByBoard))

  } catch(e) {
    
  }
}

export default function* watchManageTask() {
  yield takeLatest(GET_TASKS, getTasks)
  yield takeLatest(GET_TASKS_BY_CALENDAR, getTasksByCalendar)
  yield takeLatest(GET_TASKS_BY_BOARD, getTasksByBoard)
  yield takeLatest(LOAD_MORE_TASKS_BY_BOARD, loadMoreTasksByBoard)
}