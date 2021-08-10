export const GET_TASK_TODO = 'admin/home/getTasksTodo'
export const GET_TASK_TODO_SUCCESS = 'admin/home/getTasksTodoSuccess'

export const GET_TASK_COMPLETE_IN_DAY = 'admin/home/getTasksCompleteInday'
export const GET_TASK_COMPLETE_IN_DAY_SUCCESS = 'admin/home/getTasksCompleteIndaySuccess'

export const GET_TASK_TODAY = 'admin/home/getTasksToday'
export const GET_TASK_TODAY_SUCCESS = 'admin/home/getTasksTodaySuccess'

export const getTasksTodo = () => {
  return ({
    type: GET_TASK_TODO
  })
}

export const getTasksTodoSuccess = (tasksTodo) => {
  return ({
    type: GET_TASK_TODO_SUCCESS,
    tasksTodo
  })
}


export const getTasksCompleteInday = () => {
  return ({
    type: GET_TASK_COMPLETE_IN_DAY
  })
}

export const getTasksCompleteIndaySuccess = (tasksComplete) => {
  return ({
    type: GET_TASK_COMPLETE_IN_DAY_SUCCESS,
    tasksComplete
  })
}



export const getTasksToday = (date) => {
  return ({
    type: GET_TASK_TODAY,
    date
  })
}

export const getTasksTodaySuccess = (tasksToday) => {
  return ({
    type: GET_TASK_TODAY_SUCCESS,
    tasksToday
  })
}


export const initialStates = {
  tasksComplete: [],
  tasksToday: [],
  tasksTodo: []
}

export default function reducer(state = initialStates, action) {
  switch(action.type) {
    case GET_TASK_TODAY_SUCCESS:
      return {
        ...state,
        tasksToday: action.tasksToday
      }
    case GET_TASK_COMPLETE_IN_DAY_SUCCESS:
      return {
        ...state,
        tasksComplete: action.tasksComplete
      }
      case GET_TASK_TODO_SUCCESS:
        return {
          ...state,
          tasksTodo: action.tasksTodo
        }
    default:
      return state
  }
}