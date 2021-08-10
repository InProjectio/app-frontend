import React, { useState } from 'react'
import arrowDown from 'images/arrow-down.svg'
import classes from './PhaseItem.module.scss'
import Expand from 'react-expand-animated'
import classNames from 'classnames'
import GroupTask from '../GroupTask'

const PhaseItem = ({ phase, portal, searchObj, setSearchObj, groupIndex }) => {
  const [ openStatus, setOpenStatus ] = useState(true)

  const toggleStatus = () => {
    setOpenStatus((prevOpenStatus) => !prevOpenStatus)
  }

  // console.log('searchObj', phase)

  return (
    <div className={classes.container}
    >
      { searchObj.spaceId && !searchObj.projectId && !searchObj.phaseId
        && <p className={classes.projectName}>
          { phase.phase?.projectName }
        </p>
      }
      
      <div className={classes.row}
        onClick={toggleStatus}
      >
        <a className={classNames(classes.btnMore, !openStatus && classes.btnLess)}>
          <img src={arrowDown} className={classes.arrowDown} alt='icon' />
        </a>
        <p className={classes.phaseName}>{ phase.phase?.folder_name} </p>
      </div>
      <Expand duration={300}
        open={openStatus}
      >
        <div className={classes.status}>
          { phase.groupTasks && phase.groupTasks.map((item, i) => (
            <div className={classes.stautsItem}
              key={item.id}
            >
              <GroupTask item={item}
                groupBy='STATUS'
                portal={portal}
                searchObj={searchObj}
                setSearchObj={setSearchObj}
                groupIndex={`${groupIndex}-${i}`}
              />
            </div>
            
          )) }
        </div>
        
      </Expand>
    </div>
  )
}

export default PhaseItem
