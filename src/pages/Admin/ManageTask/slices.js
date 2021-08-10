export const GET_TASKS = 'admin/ManageTask/getTasks'
export const GET_TASKS_SUCCESS = 'admin/ManageTask/getTasksSuccess'
export const GET_TASKS_BY_CALENDAR = 'admin/ManageTask/getTasksByCalendar'
export const GET_TASKS_BY_CALENDAR_SUCCESS = 'admin/ManageTask/getTasksByCalendarSuccess'
export const GET_TASKS_BY_BOARD = 'admin/ManageTask/getTasksByBoard'
export const GET_TASKS_BY_BOARD_SUCCESS = 'admin/ManageTask/getTasksByBoardSuccess'
export const LOAD_MORE_TASKS_BY_BOARD = 'admin/ManageTask/loadMoreTasksByBoard'
export const LOAD_MORE_TASKS_BY_BOARD_SUCCESS = 'admin/ManageTask/loadMoreTasksByBoardSuccess'

export const getTasks = (query) => {
  return {
    type: GET_TASKS,
    query
  }
}

export const getTasksSuccess = ({data, taskByStatus, tasksByDueDate, tasksByAssignee}) => {
  return {
    type: GET_TASKS_SUCCESS,
    data,
    taskByStatus,
    tasksByDueDate,
    tasksByAssignee
  }
}

export const getTasksByCalendar = (query) => {
  return {
    type: GET_TASKS_BY_CALENDAR,
    query
  }
}

export const getTasksByCalendarSuccess = (tasksByCalendar) => {
  return {
    type: GET_TASKS_BY_CALENDAR_SUCCESS,
    tasksByCalendar
  }
}

export const getTasksByBoard = (query) => {
  return {
    type: GET_TASKS_BY_BOARD,
    query
  }
}

export const getTasksByBoardSuccess = (tasksByBoard) => {
  return {
    type: GET_TASKS_BY_BOARD_SUCCESS,
    tasksByBoard
  }
}

export const loadMoreTasksByBoard = ({docs, index}) => {
  return {
    type: LOAD_MORE_TASKS_BY_BOARD,
    docs,
    index
  }
}

export const loadMoreTasksByBoardSuccess = (tasksByBoard) => {
  return {
    type: LOAD_MORE_TASKS_BY_BOARD_SUCCESS,
    tasksByBoard
  }
}

export const initialState = {
  tasks: [],
  query: {},
  loadingTask: false,
  pageInfo: {},
  taskByStatus: [],
  tasksByDueDate: [],
  tasksByCalendar: [],
  tasksByBoard: [],
  tasksByAssignee: []
}

export default function manageTaskReducer(state = initialState, action) {
  switch(action.type) {
    case GET_TASKS:
      return {
        ...state,
        query: action.query
      }
    case GET_TASKS_SUCCESS:
      const {docs, pageInfo} = action.data
      return {
        ...state,
        tasks: docs,
        pageInfo,
        taskByStatus: action.taskByStatus || [],
        tasksByDueDate: action.tasksByDueDate || [],
        tasksByAssignee: action.tasksByAssignee || []
      }
    case GET_TASKS_BY_CALENDAR_SUCCESS:
      return {
        ...state,
        tasksByCalendar: action.tasksByCalendar
      }
    case GET_TASKS_BY_BOARD_SUCCESS:
      return {
        ...state,
        tasksByBoard: action.tasksByBoard
      }
    case LOAD_MORE_TASKS_BY_BOARD_SUCCESS:
      return {
        ...state,
        tasksByBoard: action.tasksByBoard
      }
    default:
      return state
  }
}




