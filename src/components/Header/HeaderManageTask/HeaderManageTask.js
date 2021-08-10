import React, { useMemo } from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import listIcon from 'images/header/list.png'
import boardIcon from 'images/header/board.png'
import calendarIcon from 'images/header/calendar.png'
// import viewIcon from 'images/header/view.png'
import { convertSearchParamsToObject, convertObjectToSearchParams, convertParamsFromPathname } from 'utils/utils'
import classes from './HeaderManageTask.module.scss'
import { createStructuredSelector } from 'reselect'
import {
  selectSpaces
} from 'layout/AdminLayout/selectors'
import { useSelector } from 'react-redux'
import { SpaceTypeColor } from 'utils/constants';
import fileIcon from 'images/sidebar/file.png'

const mapStateToProps = createStructuredSelector({
  spaces: selectSpaces()
})

const HeaderManageTask = ({ location }) => {

  const { spaces } = useSelector(mapStateToProps)

  const {show, searchObj, space, project, phase} = useMemo(() => {
    const { show } = convertSearchParamsToObject(location.search)
    const { spaceId, projectId, phaseId } = convertParamsFromPathname(location.pathname)
    let space;
    let project;
    let phase;
    if (spaces && spaceId) {
      space = spaces.find((space) => space.workspace_id === +spaceId)
      if (space && projectId) {
        project = space.projects.find((project) => project.project_id === +projectId)
        if (phaseId && project) {
          phase = project.phases.find((folder) => folder.folder_id === +phaseId)
        }
      }
    }
    return {
      show: show || ((spaceId || projectId || phaseId) ? 'LIST' : null),
      searchObj: {
        spaceId,
        projectId,
        phaseId
      },
      space,
      project,
      phase
    }
  }, [location.pathname, location.search, spaces])

  console.log('project', project)

  return (
    <div className={classes.container}>
      { space && !project
        && <div className={classes.row}>
          <div className={classes.spaceIcon}
            style={{
              backgroundColor: SpaceTypeColor[space.workspace_name.slice(0, 1)]
            }}
          >
            {space.workspace_name.slice(0, 1)}
          </div>
          <p className={classes.spaceName}>
            { space.workspace_name }
          </p>
        </div>
      }

      { project && !phase
        && <div className={classes.row}>
          <div className={classes.iconWrapper}
          >
            <img src={fileIcon} className={classes.fileIcon} alt='fileIcon'/>
          </div>
          <p className={classes.spaceName}>
            { project.project_name }
          </p>
        </div>
      }

      { phase
        && <div className={classes.row}>
          <div className={classes.iconWrapper}
          >
            <div className={classes.circle} />
          </div>
          <p className={classes.spaceName}>
            { phase.folder_name }
          </p>
        </div>
      }
      

      <Link className={classNames(classes.row, show === 'LIST' && classes.active)}
        to={`${location.pathname}${convertObjectToSearchParams({ ...searchObj, show: 'LIST' })}`}
      >
        <img src={listIcon} className={classes.icon} alt='icon' />
        <p className={classes.text}>
          <FormattedMessage id='Header.list'
            defaultMessage='List'
          />
        </p>
      </Link>

      <Link className={classNames(classes.row, show === 'BOARD' && classes.active)}
        to={`${location.pathname}${convertObjectToSearchParams({ ...searchObj, show: 'BOARD' })}`}
      >
        <img src={boardIcon} className={classes.icon} alt='icon' />
        <p className={classes.text}>
          <FormattedMessage id='Header.list'
            defaultMessage='Board'
          />
        </p>
      </Link>

      <Link className={classNames(classes.row, show === 'CALENDAR' && classes.active)}
        to={`${location.pathname}${convertObjectToSearchParams({ ...searchObj, show: 'CALENDAR' })}`}
      >
        <img src={calendarIcon} className={classes.icon} alt='icon' />
        <p className={classes.text}>
          <FormattedMessage id='Header.list'
            defaultMessage='Calendar'
          />
        </p>
      </Link>
    </div>
  )
}

export default HeaderManageTask
