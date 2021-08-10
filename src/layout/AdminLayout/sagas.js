import { call, put, select, takeLatest } from 'redux-saga/effects'
import {
  GET_SPACES,
  ADD_SPACE,
  UPDATE_SPACE,
  DELETE_SPACE,
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  ADD_PHASE,
  UPDATE_PHASE,
  DELETE_PHASE,
  getSpacesSuccess,
  setSpaces,
  GET_LABELS,
  getLabelsSuccess,
  GET_NOTIFICATION,
  getNotificationSuccess
} from './slices'
import * as Api from 'api/api'
import { selectSpaces } from './selectors'

function* getSpaces() {
  try {
    const result = yield call(Api.get, {
      url: '/workspace/list-detail'
    })

    yield put(getSpacesSuccess(result.data))
  } catch(e) {

  }
}


function* deleteSpace({ spaceId }) {
  const spaces = yield select(selectSpaces())
  const newSpaces = spaces.filter((item) => item.workspace_id !== spaceId)
  yield put(setSpaces(newSpaces))
}


function* deleteProject({ spaceId, projectId }) {
  const spaces = yield select(selectSpaces())
  const newSpaces = spaces.map((item) => {
    if (item.workspace_id === spaceId) {
      const newProjects = item.projects.filter((project) => project.project_id !== projectId)
      return {
        ...item,
        projects: newProjects
      }
    }
    return item
  })
  yield put(setSpaces(newSpaces))
}

function* addPhase({ spaceId, projectId, phase }) {
  const spaces = yield select(selectSpaces())
  const newSpaces = spaces.map((item) => {
    if (item.workspace_id === spaceId) {
      const newProjects = item.projects.map((project) => {
        if (project.project_id === projectId) {
          return {
            ...project,
            phases: [...project.phases, phase]
          }
        }
        return project
      })
      return {
        ...item,
        projects: newProjects
      }
    }
    return item
  })
  yield put(setSpaces(newSpaces))
}

function* updatePhase({ spaceId, projectId, phase, toProjectId }) {
  const spaces = yield select(selectSpaces())
  const newSpaces = spaces.map((item) => {
    if (item.workspace_id === spaceId) {
      const newProjects = item.projects.map((project) => {
        if (project.project_id === projectId && projectId === toProjectId) {
          return {
            ...project,
            phases: project.phases.map((phaseItem) => phaseItem.folder_id === phase.folder_id ? phase : phaseItem)
          }
        }
        if (project.project_id === projectId && projectId !== toProjectId) {
          return {
            ...project,
            phases: project.phases.filter((phaseItem) => phaseItem.folder_id !== phase.folder_id)
          }
        }
        if (project.project_id === toProjectId && projectId !== toProjectId) {
          return {
            ...project,
            phases: [...project.phases, phase]
          }
        }

        return project
      })
      return {
        ...item,
        projects: newProjects
      }
    }
    return item
  })
  yield put(setSpaces(newSpaces))
}

function* deletePhase({ spaceId, projectId, phaseId }) {
  const spaces = yield select(selectSpaces())
  const newSpaces = spaces.map((item) => {
    if (item.workspace_id === spaceId) {
      const newProjects = item.projects.map((project) => {
        if (project.project_id === projectId) {
          return {
            ...project,
            phases: project.phases.filter((phaseItem) => phaseItem.folder_id !== phaseId)
          }
        }
        return project
      })
      return {
        ...item,
        projects: newProjects
      }
    }
    return item
  })
  yield put(setSpaces(newSpaces))
}

function* getLabels({spaceId}) {
  try {
    const result = yield call(Api.get, {
      url: '/label/list',
      params: {
        workspace_id: spaceId
      }
    })
    yield put(getLabelsSuccess(result.data))
  } catch(e) {
    console.log(e)
  }
}

function* getNotification() {
  try {
    const result = yield call(Api.get, {
      url: '/task/overdue',
      params: {
        page: 1,
        cleared: 'n'
      }
    })
    yield put(getNotificationSuccess(result.data))
  } catch(e) {
    console.log(e)
  }
}

export default function* watchAdminLayoutData() {
  yield takeLatest(GET_SPACES, getSpaces)
  yield takeLatest(ADD_SPACE, getSpaces)
  yield takeLatest(UPDATE_SPACE, getSpaces)
  yield takeLatest(DELETE_SPACE, deleteSpace)

  yield takeLatest(ADD_PROJECT, getSpaces)
  yield takeLatest(UPDATE_PROJECT, getSpaces)
  yield takeLatest(DELETE_PROJECT, deleteProject)

  yield takeLatest(ADD_PHASE, addPhase)
  yield takeLatest(UPDATE_PHASE, updatePhase)
  yield takeLatest(DELETE_PHASE, deletePhase)

  yield takeLatest(GET_LABELS, getLabels)
  yield takeLatest(GET_NOTIFICATION, getNotification)
}