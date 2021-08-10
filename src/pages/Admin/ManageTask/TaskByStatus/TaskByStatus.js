import React from 'react'
import classes from './TaskByStatus.module.scss'
import PhaseItem from '../PhaseItem'

const TaskByStatus = ({ data, portal, searchObj, setSearchObj }) => {
  return (
    <div className={classes.container}>
      { data && data.map((item, i) => (
        <PhaseItem key={item.phase?.folder_id || i}
          phase={item}
          portal={portal}
          searchObj={searchObj}
          setSearchObj={setSearchObj}
          groupIndex={i}
        />
      )) }
    </div>
  )
}

export default TaskByStatus
