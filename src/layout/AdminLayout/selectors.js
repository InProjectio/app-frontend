import { createSelector } from 'reselect'
import { initialStates } from './slices'

export const selectGlobal = (state) => state.global || initialStates

export const selectShowTaskForm = () => createSelector(
  selectGlobal,
  globalState => globalState.showTaskForm
)

export const selectSelectedTask = () => createSelector(
  selectGlobal,
  globalState => globalState.selectedTask
)

export const selectSelectedPhase = () => createSelector(
  selectGlobal,
  globalState => globalState.selectedPhase
)


export const selectSpaces = () => createSelector(
  selectGlobal,
  globalState => globalState.spaces
)

export const selectSpacesOptions = () => createSelector(
  selectGlobal,
  globalState => globalState.spaces.map((item) => ({...item, label: item.workspace_name, value: item.workspace_id}))
)

export const selectProjectsBySpace = () => createSelector(
  selectGlobal,
  (state, props) => props.spaceId,
  (globalState, spaceId) => {
    const selectedSpace = globalState.spaces.find(item => item.workspace_id === spaceId)
    return selectedSpace ? selectedSpace.projects.map((item) => ({...item, label: item.project_name, value: item.project_id})) : []
  }
)

export const selectLabels = () => createSelector(
  selectGlobal,
  globalState => globalState.labels
)


export const selectNotification = () => createSelector(
  selectGlobal,
  globalState => globalState.notification
)