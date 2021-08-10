import React, { useRef, useMemo } from 'react'
import plusIcon from 'images/sidebar/plus.png'
import contextIcon from 'images/sidebar/context.png'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import classes from './Phase.module.scss'
import useShowContext from '../hooks/useShowContext'
import Context from '../Context'

const Phase = ({
  phase,
  handleClickPlusPhase,
  handleEditPhase,
  handleDeletePhase,
  spaceId,
  projectId,
  selectedPhaseId,
  projectRole,
  projectPath
}) => {
  const contextRef = useRef(null)
  const [showContext, setShowContext] = useShowContext(contextRef)

  const handleClickContextPhase = () => {
    setShowContext(true)
  }

  const phasePath = useMemo(() => {
    return `${projectPath}/p-${phase.folder_name.replaceAll(' ', '-').toLowerCase()}-${phase.folder_id}`
  }, [])

  return (
    <div className={classNames(classes.container, selectedPhaseId === phase.folder_id && classes.active)}>
      <div className={classes.circle} />
      <div className={classes.nameWrapper}>
        <Link className={classes.phaseName}
          to={phasePath}
          onClick={(e) => e.stopPropagation()}
        >
          {phase.folder_name}
        </Link>
      </div>
      { projectRole === 'ASSIGNEE'
        && <>
          <a className={classes.contextPhase}
            onClick={handleClickContextPhase}
          >
            <img src={contextIcon} alt='icon' className={classes.contextIcon} />
          </a>
          <a className={classes.addPhase}
            onClick={(e) => {
              e.stopPropagation()
              handleClickPlusPhase({...phase, project_id: projectId})
            }}
          >
            <img src={plusIcon} alt='icon' className={classes.plusIcon} />
          </a>
        </>
      }
      
      { showContext
        && <div className={classes.contextWrapper}
          ref={contextRef}
        >
          <Context handleEdit={() => handleEditPhase(phase, projectId)}
            handleDelete={() => handleDeletePhase(phase, projectId, spaceId)}
            handleClose={() => setShowContext(false)}
          />
        </div>
      }
    </div>
  )
}

export default Phase
