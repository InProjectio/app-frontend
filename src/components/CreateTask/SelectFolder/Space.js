import React, { useState } from 'react'
import classes from './SelectFolder.module.scss'
import Expand from 'react-expand-animated'
import caretIcon from 'images/caret-down.svg'
import classNames from 'classnames'
import Project from './Project'

const Space = ({ space, handleChangePhase }) => {
  const [showProjects, setShowProjects] = useState(false)
  return (
    <div className={classes.space}>
      <div className={classes.row}
        onClick={() => setShowProjects((prevShow) => !prevShow)}
      >
        <img src={caretIcon} className={classNames(classes.caretIcon, showProjects && classes.caretIconShow)} alt='caret-icon'/>
        <div className={classes.type}>
          {space.workspace_name.slice(0, 1)}
        </div>
        <p className={classes.spaceName}>
          { space.workspace_name }
        </p>
      </div>
      <Expand open={showProjects}
        duration={300}
      >
        { space.projects.map((project) => (
          <Project project={project} key={project.project_id}
            handleChangePhase={handleChangePhase}
          />
        )) }
        
      </Expand>
    </div>
  )
}

export default Space
