import React from 'react';
import moment from 'moment';
// import Dotdotdot from 'components/Dotdotdot';
import { TASK_STATUS_OBJ } from 'utils/constants';
// import classNames from 'classnames'

const EventWrapper = ({ event, children, type, handleShowTaskForm }) => {
  const { title, className } = children.props;

  const startDay = moment(`${moment(event.start).format('YYYY-MM-DD')}`)
  const hourStart = moment(event.start)
  const hourStop = moment(event.end)
  const minuteStart = hourStart.diff(startDay, 'minutes')
  const minuteStop = hourStop.diff(startDay, 'minutes')
  const column = Math.round((minuteStop - minuteStart) / 5)
  const gridRowStart = Math.round(minuteStart / 5) + 1
  // let lineNumbers = 3
  // if (column <= 2) {
  //   lineNumbers = 1
  // }

  // console.log('type ===> ', type, event)

  return (
    <div
      title={title}
      className={className}
      style={{ gridRow: `${gridRowStart} / span ${column}`,
      backgroundColor: TASK_STATUS_OBJ[event.status].color,
      borderRadius: '0px',
      opacity: 0.8,
      color: '#000000',
      border: '0px',
      display: 'block'
      }}
      onClick={() => handleShowTaskForm(event.folder, event)}
    >
      { type === 'time'
        ? <React.Fragment>
          <div className='rbc-event-label'>
            { event.title } ({ hourStart.format('HH:mm') } - {hourStop.format('HH:mm')})
          </div>
        </React.Fragment>
        : <React.Fragment>
          {children.props.children}
        </React.Fragment>
      }
    </div>
  );
};

export default EventWrapper;
