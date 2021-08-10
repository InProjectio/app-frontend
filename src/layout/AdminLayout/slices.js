export const SHOW_TASK_FORM = 'inProject/adminLayout/showTaskForm'
export const CLOSE_TASK_FORM = 'inProject/adminLayout/closeTaskForm'
export const GET_SPACES = 'inProject/adminLayout/getSpaces'
export const GET_SPACES_SUCCESS = 'inProject/adminLayout/getSpacesSuccess'
export const GET_NOTIFICATION = 'inProject/adminLayout/getNotifications'
export const GET_NOTIFICATION_SUCCESS = 'inProject/adminLayout/getNotificationSuccess'
export const ADD_SPACE = 'inProject/adminLayout/addSpace'
export const UPDATE_SPACE = 'inProject/adminLayout/updateSpace'
export const DELETE_SPACE = 'inProject/adminLayout/deleteSpace'
export const SET_SPACES = 'inProject/adminLayout/setSpaces'
export const ADD_PROJECT = 'inProject/adminLayout/addProject'
export const UPDATE_PROJECT = 'inProject/adminLayout/updateProject'
export const DELETE_PROJECT = 'inProject/adminLayout/deleteProject'
export const ADD_PHASE = 'inProject/adminLayout/addPhase'
export const UPDATE_PHASE = 'inProject/adminLayout/updatePhase'
export const DELETE_PHASE = 'inProject/adminLayout/deletePhase'
export const GET_LABELS = 'inProject/adminLayout/getLabels'
export const GET_LABELS_SUCCESS = 'inProject/adminLayout/getLabelsSuccess'
export const SET_LABELS = 'inProject/adminLayout/setLabels'

export const setLabels = (labels) => {
  return {
    type: SET_LABELS,
    labels
  }
}

export const getLabels = (spaceId) => {
  return {
    type: GET_LABELS,
    spaceId
  }
}

export const getLabelsSuccess = (labels) => {
  return {
    type: GET_LABELS_SUCCESS,
    labels
  }
}

export const getNotification = () => {
  return {
    type: GET_NOTIFICATION
  }
}

export const getNotificationSuccess = (notification) => {
  return {
    type: GET_NOTIFICATION_SUCCESS,
    notification
  }
}

export const handleShowTaskForm = (phase, task) => {
  return {
    type: SHOW_TASK_FORM,
    selectedTask: task,
    selectedPhase: phase
  }
}

export const handleCloseTaskForm = () => {
  return {
    type: CLOSE_TASK_FORM,
  }
}

export const getSpaces = () => {
  return {
    type: GET_SPACES,
  }
}

export const getSpacesSuccess = (spaces) => {
  return {
    type: GET_SPACES_SUCCESS,
    spaces
  }
}

export const addSpace = (values) => {
  return {
    type: ADD_SPACE,
    values
  }
}

export const updateSpace = (values) => {
  return {
    type: UPDATE_SPACE,
    values
  }
}

export const deleteSpace = (spaceId) => {
  return {
    type: DELETE_SPACE,
    spaceId
  }
}

export const setSpaces = (spaces) => {
  return {
    type: SET_SPACES,
    spaces
  }
}

export const addProject = ({spaceId, project}) => {
  return {
    type: ADD_PROJECT,
    spaceId,
    project
  }
}

export const updateProject = ({spaceId, project, toSpaceId}) => {
  return {
    type: UPDATE_PROJECT,
    spaceId,
    project,
    toSpaceId
  }
}

export const deleteProject = ({spaceId, projectId}) => {
  return {
    type: DELETE_PROJECT,
    spaceId,
    projectId
  }
}

export const addPhase = ({spaceId, projectId, phase}) => {
  return {
    type: ADD_PHASE,
    spaceId,
    projectId,
    phase
  }
}

export const updatePhase = ({spaceId, projectId, toProjectId, phase}) => {
  return {
    type: UPDATE_PHASE,
    spaceId,
    projectId,
    phase,
    toProjectId
  }
}

export const deletePhase = ({spaceId, projectId, phaseId}) => {
  return {
    type: DELETE_PHASE,
    spaceId,
    projectId,
    phaseId
  }
}

export const initialStates = {
  showTaskForm: false,
  selectedTask: null,
  selectedPhase: null,
  spaces: [],
  labels: [],
  notification: {}
}

export default function adminLayoutReducer(state = initialStates, action) {
  switch (action.type) {
    case SHOW_TASK_FORM:
      return {
        ...state,
        showTaskForm: true,
        selectedTask: action.selectedTask,
        selectedPhase: action.selectedPhase
      }
    case CLOSE_TASK_FORM:
      return {
        ...state,
        showTaskForm: false,
      }
    case GET_SPACES_SUCCESS:
      return {
        ...state,
        spaces: action.spaces
      }
    case SET_SPACES:
      return {
        ...state,
        spaces: action.spaces
      }
    case GET_LABELS_SUCCESS:
      return {
        ...state,
        labels: action.labels
      }
    case SET_LABELS:
      return {
        ...state,
        labels: action.labels
      }
    case GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notification: action.notification
      }
    default:
      return state
  }
}