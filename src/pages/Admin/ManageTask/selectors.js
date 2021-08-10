import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectManageTask = (state) => state.ManageTask || initialState

export const selectTasks = () => createSelector(
  selectManageTask,
  state => state.tasks
)

export const selectTaskByStatus = () => createSelector(
  selectManageTask,
  state => state.taskByStatus
)

export const selectTasksByCalendar = () => createSelector(
  selectManageTask,
  state => state.tasksByCalendar
)

export const selectTasksByBoard = () => createSelector(
  selectManageTask,
  state => state.tasksByBoard
)

export const selectTasksByAssignee = () => createSelector(
  selectManageTask,
  state => state.tasksByAssignee
)

export const selectTasksByDueDate = () => createSelector(
  selectManageTask,
  state => state.tasksByDueDate
)

export const selectPageInfo = () => createSelector(
  selectManageTask,
  state => state.pageInfo
)

export const selectQuery = () => createSelector(
  selectManageTask,
  state => state.query
)
