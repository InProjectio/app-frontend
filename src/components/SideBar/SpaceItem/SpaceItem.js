import React, { useState, useRef, useEffect, useMemo } from 'react'
import Expand from 'react-expand-animated';
import plusIcon from 'images/sidebar/plus.png'
import contextIcon from 'images/sidebar/context.png'
import classNames from 'classnames'
import classes from './SpaceItem.module.scss'
import Project from '../Project'
import Context from '../Context';
import useShowContext from '../hooks/useShowContext';
import { Link } from 'react-router-dom';
import { SpaceTypeColor } from 'utils/constants';

const SpaceItem = ({
  space,
  handleShowCreateProject,
  handleShowCreatePhase,
  handleShowCreateSpace,
  handleDeleteSpace,
  handleDeletePhase,
  handleDeleteProject,
  selectedSpaceId,
  selectedProjectId,
  selectedPhaseId,
  handleShowTaskForm,
  handleShowMembers,
  collapse
}) => {
  const [showProjects, setShowProjects] = useState(!!(selectedSpaceId === space.workspace_id && selectedProjectId))
  const contextRef = useRef(null)
  const [ showContext, setShowContext ] = useShowContext(contextRef)

  useEffect(() => {
    if (selectedSpaceId === space.workspace_id && selectedProjectId) {
      setShowProjects(true)
    }
  }, [selectedSpaceId, selectedProjectId])

  const handleClickSpace = () => {
    setShowProjects((prevShow) => !prevShow)
  }

  const handleClickContext = (e) => {
    e.stopPropagation()
    setShowContext(true)
  }

  const handleClickPlus = (e) => {
    e.stopPropagation()
    handleShowCreateProject(space)
  }

  const handleShowEditProject = (project) => {
    handleShowCreateProject(space, project)
  }

  const spacePath = useMemo(() => {
    return `/s-${space.workspace_name.replaceAll(' ', '-').toLowerCase()}-${space.workspace_id}`
  }, [space.workspace_name, space.workspace_id])

  return (
    <div className={classNames(classes.container, collapse && classes.collapse)}>
      <div className={classNames(classes.spaceNameWrapper,
        selectedSpaceId === space.workspace_id && !selectedProjectId && classes.active)}
        onClick={handleClickSpace}
      >
        <div className={classes.type}
          style={{
            backgroundColor: SpaceTypeColor[space.workspace_name.slice(0, 1)]
          }}
        >
          {space.workspace_name.slice(0, 1)}
        </div>
        <div className={classes.nameWrapper}>
          <Link className={classes.spaceName}
            to={spacePath}
            onClick={(e) => {
              e.stopPropagation()
              if (selectedSpaceId === space.workspace_id && !selectedProjectId) {
                handleClickSpace()
              } else if (!showProjects){
                setShowProjects(true)
              }
            }}
          >
            {space.workspace_name}
          </Link>
        </div>
        { (space.is_owner === 'y' || space.role === 'ASSIGNEE')
          && <a className={classes.context}
            onClick={handleClickContext}
          >
            <img src={contextIcon} alt='icon' className={classes.contextIcon} />
          </a>
        }
        { space.role === 'ASSIGNEE'
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
            <Context handleEdit={space.is_owner === 'y' && (() => handleShowCreateSpace(space))}
              handleDelete={space.is_owner === 'y' && (() => handleDeleteSpace(space))}
              handleViewMembers={space.role === 'ASSIGNEE' && (() => handleShowMembers({space}))}
              handleClose={() => setShowContext(false)}
            />
          </div>
        }
        
      </div>
      <Expand open={showProjects}
        duration={300}
      >
        <div className={classes.projects}>
          {space.projects && space.projects.map((project) => (
            <div className={classes.project}
              key={project.project_id}
            >
              <Project project={project}
                handleShowCreatePhase={handleShowCreatePhase}
                handleShowEditProject={handleShowEditProject}
                handleDeletePhase={handleDeletePhase}
                handleDeleteProject={handleDeleteProject}
                spaceId={space.workspace_id}
                spaceName={space.workspace_name}
                spacePath={spacePath}
                selectedProjectId={selectedProjectId}
                selectedPhaseId={selectedPhaseId}
                handleShowTaskForm={handleShowTaskForm}
                handleShowMembers={handleShowMembers}
              />
            </div>
          ))}
        </div>
      </Expand>
    </div>
  )
}

export default SpaceItem
