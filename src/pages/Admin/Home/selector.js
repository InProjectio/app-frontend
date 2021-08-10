import { createSelector } from 'reselect'
import { initialStates } from './slices'

export const selectHomeState = (state) => state.home || initialStates

export const selectTasksToday = () => createSelector(
  selectHomeState,
  homeState => homeState.tasksToday
)

export const selectTasksTodo = () => createSelector(
  selectHomeState,
  homeState => homeState.tasksTodo
)

export const selectTasksComplete = () => createSelector(
  selectHomeState,
  homeState => homeState.tasksComplete
)
