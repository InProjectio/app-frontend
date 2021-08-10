import React, { useState, useRef, useEffect, useMemo } from 'react'
import fileIcon from 'images/sidebar/file.png'
import plusIcon from 'images/sidebar/plus.png'
import contextIcon from 'images/sidebar/context.png'
import Expand from 'react-expand-animated';
import classNames from 'classnames'
import classes from './Project.module.scss'
import Context from '../Context'
import Phase from '../Phase'
import useShowContext from '../hooks/useShowContext';
import { Link } from 'react-router-dom';

const Project = ({ project,
  handleShowCreatePhase,
  handleShowEditProject,
  handleDeletePhase,
  handleDeleteProject,
  spaceId,
  selectedProjectId,
  selectedPhaseId,
  handleShowTaskForm,
  handleShowMembers,
  spacePath,
  spaceName
}) => {
  const [ showPhases, setShowPhases ] = useState(!!(selectedProjectId === project.project_id && selectedPhaseId))
  const contextRef = useRef(null)
  const [showContext, setShowContext] = useShowContext(contextRef)

  useEffect(() => {
    if (selectedProjectId === project.project_id && selectedPhaseId) {
      setShowPhases(true)
    }
  }, [selectedProjectId, selectedPhaseId])

  const handleClickProject = () => {
    setShowPhases((prevShow) => !prevShow)
  }

  const handleClickContext = (e) => {
    e.stopPropagation()
    setShowContext(true)
  }

  const handleClickPlus = (e) => {
    e.stopPropagation()
    handleShowCreatePhase(project, null, spaceId, spaceName)
  }

  const handleClickPlusPhase = (phase) => {
    handleShowTaskForm(phase)
  }

  const handleEditPhase = (phase) => {
    handleShowCreatePhase(project, phase, spaceId)
  }

  const projectPath = useMemo(() => {
    return `${spacePath}/pj-${project.project_name.replaceAll(' ', '-').toLowerCase()}-${project.project_id}`
  }, [])


  return (
    <div className={classes.container}>
      <div className={classNames(classes.row, selectedProjectId === project.project_id && !selectedPhaseId && classes.active)}
        onClick={handleClickProject}
      >
        <img src={fileIcon} className={classes.fileIcon} alt='icon'/>
        <div className={classes.nameWrapper}>
          <Link className={classes.projectName}
            to={projectPath}
            onClick={(e) => {
              e.stopPropagation()
              if (selectedProjectId === project.project_id && !selectedPhaseId) {
                handleClickProject()
              } else if (!showPhases){
                setShowPhases(true)
              }
            }}
          >
            { project.project_name }
          </Link>
        </div>
        
        {(project.is_owner === 'y' || project.role === 'ASSIGNEE')
         && <a className={classes.context}
            onClick={handleClickContext}
          >
            <img src={contextIcon} alt='icon' className={classes.contextIcon} />
          </a>
        }
        { project.role === 'ASSIGNEE'
          && <a className={classes.add}
            onClick={handleClickPlus}
          >
            <img src={plusIcon} alt='icon' className={classes.plusIcon} />
          </a>
        }
        

        { showContext
          && <div className={classes.contextWrapper}
            ref={contextRef}
          >
            <Context handleEdit={project.is_owner === 'y' && (() => handleShowEditProject(project))}
              handleDelete={project.is_owner === 'y' && (() => handleDeleteProject(project, spaceId))}
              handleViewMembers={project.role === 'ASSIGNEE' && (() => handleShowMembers({project}))}
              handleClose={() => setShowContext(false)}
            />
          </div>
        }
      </div>

      <Expand open={showPhases}
        duration={300}
      >
        <div className={classes.phases}>
          { project && project.phases && project.phases.map((phase) => (
            <div className={classes.phase}
              key={phase.folder_id}
            >
              <Phase phase={phase}
                handleClickPlusPhase={handleClickPlusPhase}
                handleEditPhase={handleEditPhase}
                handleDeletePhase={handleDeletePhase}
                spaceId={spaceId}
                projectId={project.project_id}
                selectedPhaseId={selectedPhaseId}
                projectRole={project.role}
                projectPath={projectPath}
              />
            </div>
          )) }
        </div>
      </Expand>
      
      
    </div>
  )
}

export default Project
