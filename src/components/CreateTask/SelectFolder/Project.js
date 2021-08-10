import React, { useState } from 'react'
import classes from './SelectFolder.module.scss'
import Expand from 'react-expand-animated'
import caretIcon from 'images/caret-down.svg'
import folderIcon from 'images/folder.svg'
import classNames from 'classnames'

const Project = ({ project, handleChangePhase }) => {
  const [ showPhases, setShowPhases ] = useState(false)
  return (
    <div className={classes.project}>
      <div className={classNames(classes.row, project.role === 'VIEWER' && classes.disabled)}
        onClick={() => setShowPhases((prevShow) => !prevShow)}
      >
        <img src={caretIcon} className={classNames(classes.caretIcon, showPhases && classes.caretIconShow)} alt='caret-icon'/>
        <img src={folderIcon} className={classes.folderIcon} alt='folder-icon'/>
        <p className={classes.projectName}>
          { project.project_name }
        </p>
      </div>
      <Expand open={showPhases}
        duration={300}
      >
        { project.phases.map((item) => (
          <div className={classes.item}
            key={item.folder_id}
            onClick={() => handleChangePhase({...item, project_id: project.project_id})}
          >
            <span className={classes.circle} />
            { item.folder_name }
          </div>
        )) }
      </Expand>
      
    </div>
  )
}

export default Project
