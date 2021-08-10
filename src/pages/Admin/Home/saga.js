import {call, put, takeLatest} from 'redux-saga/effects'
import {
  GET_TASK_TODAY,
  getTasksTodaySuccess,
  GET_TASK_TODO,
  getTasksTodoSuccess,
  GET_TASK_COMPLETE_IN_DAY,
  getTasksCompleteIndaySuccess
} from './slices'
import * as Api from 'api/api'
import moment from 'moment'

function* getTasksToday({ date }) {
  try {
    const result = yield call(Api.get, {
      url: '/task/task-in-day',
      params: {
        date
      }
    })

    const tasks = result.data.map((item) => ({
      ...item,
      ...item.tasks,
      start: moment.unix(item.tasks.start_date).toDate(),
      end: moment.unix(item.tasks.end_date).toDate(),
      title: item.tasks.task_name,
      folder: item.folders,
    }) )

    yield put(getTasksTodaySuccess(tasks))
  } catch(e) {

  }
}

function* getTasksTodo() {
   try {
    const result = yield call(Api.get, {
      url: '/task/todo-task'
    })

    let todays = []
    let overdue = []
    let next = []

    const currentDateStart = moment().startOf('day').unix()
    const currentDateEnd = moment().endOf('day').unix()

    result.data.forEach(task => {
      if (task.tasks.end_date <= currentDateStart) {
        overdue.push({...task, ...task.tasks, members: task.members})
      } else if (task.tasks.start_date >= currentDateEnd) {
        next.push({...task, ...task.tasks, members: task.members})
      } else {
        todays.push({...task, ...task.tasks, members: task.members})
      }
    });

    yield put(getTasksTodoSuccess([{
      label: 'Today',
      value: 'today',
      tasks: todays
    }, {
      label: 'Overdue',
      value: 'overdue',
      tasks: overdue
    }, {
      label: 'Next',
      value: 'next',
      tasks: next
    }]))
  } catch(e) {
    
  }
}

function* getTasksComplete() {
  try {
    const result = yield call(Api.get, {
      url: '/task/completed-task-in-day'
    })
    yield put(getTasksCompleteIndaySuccess(result.data.map((task) => ({...task, ...task.tasks, members: task.members}))))
  } catch(e) {
    
  }
}

export default function* saga() {
  yield takeLatest(GET_TASK_TODAY, getTasksToday)
  yield takeLatest(GET_TASK_TODO, getTasksTodo)
  yield takeLatest(GET_TASK_COMPLETE_IN_DAY, getTasksComplete)
}