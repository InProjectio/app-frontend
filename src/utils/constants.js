export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';


export const GROUP_BY_OBJ = {
  STATUS: 'Status',
  DUE_DATE: 'Due Date',
  ASSIGNEE: 'Assignee'
}

export const PERIODS = [{
  label: 'Day',
  value: 'day',
  type: 'D'
}, {
  label: 'Work week',
  value: 'work_week',
  type: '5'
}, {
  label: 'Week',
  value: 'week',
  type: 'W'
}, {
  label: 'Month',
  value: 'month',
  type: 'M'
}]

export const PERIODS_OBJ = {
  day: 'Day',
  work_week: 'Work week',
  week: 'Week',
  month: 'Month',
  agenda: 'Agenda'
}

export const MEMBER_ROLES = [{
  label: 'Viewer',
  value: 'VIEWER'
}, {
  label: 'Assignee',
  value: 'ASSIGNEE'
}]

export const LABELS = [{
  color: '#61bd4f',
  hoverColor: '#519839',
  code: 'GREEN',
  id: 1
}, {
  color: '#f2d600',
  hoverColor: '#d9b51c',
  code: 'YELLOW',
  id: 2
}, {
  color: '#ff9f1a',
  hoverColor: '#cd8313',
  code: 'ORANGE',
  id: 3
}, {
  color: '#eb5a46',
  hoverColor: '#b04632',
  code: 'RED',
  id: 4
}, {
  color: '#c377e0',
  hoverColor: '#89609e',
  code: 'PURPLE',
  id: 5
}, {
  color: '#0079bf',
  hoverColor: '#055a8c',
  code: 'BLUE',
  id: 6
}, {
  color: '#00c2e0',
  hoverColor: '#0098b7',
  code: 'SKY',
  id: 7
}, {
  color: '#51e898',
  hoverColor: '#0098b7',
  code: 'LIME',
  id: 8
}, {
  color: '#ff78cb',
  hoverColor: '#0098b7',
  code: 'PINK',
  id: 9
}, {
  color: '#344563',
  hoverColor: '#0098b7',
  code: 'BLACK',
  id: 10
}, {
  color: '#b3bac5',
  hoverColor: '#0098b7',
  code: 'NO_COLOR',
  id: 11
}]

export const SpaceTypeColor = {
  'A': '#290ea3',
  'B': '#c6f46e',
  'C': '#ac82c1',
  'D': '#16e9c2',
  'E': '#c15c0b',
  'F': '#911371',
  'G': '#9987bd',
  'I': '#f26e0f',
  'J': '#716e40',
  'K': '#db4da2',
  'L': '#cf58db',
  'M': '#3e9833',
  'N': '#59b63d',
  'O': '#22788f',
  'P': '#5887e2',
  'Q': '#e1a1b9',
  'R': '#9b2a3d',
  'S': '#bb3466',
  'T': '#ca9809',
  'U': '#80cf09',
  'V': '#f0256a',
  'W': '#036869',
  'X': '#49e2aa',
  'Y': '#cbcf13',
  'Z': '#54af78',
}

export const TASK_STATUS = [{
  color: '#C4C4C4',
  label: 'Todo',
  value: 'todo'
},
{
  color: '#08ADFF',
  label: 'In progress',
  value: 'progress'
},
{
  color: '#7B68EE',
  label: 'Ready',
  value: 'ready'
},
{
  color: '#59C03F',
  label: 'Complete',
  value: 'complete'
}
]

export const TASK_STATUS_OBJ = {
  todo: {
    color: '#C4C4C4',
    label: 'Todo',
    value: 'todo'
  },
  progress: {
    color: '#08ADFF',
    label: 'In progress',
    value: 'progress'
  },
  ready: {
    color: '#7B68EE',
    label: 'Ready',
    value: 'ready'
  },
  complete: {
    color: '#59C03F',
    label: 'Complete',
    value: 'complete'
  }
}