import UserHeader from 'components/UserHeader'
import React, {useState} from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'
import classes from './UserLayout.module.scss'
import MenusMobile from './MenusMobile'
import NotFound from 'pages/NotFound'
import Planning from 'pages/Planning'
import AcceptInvite from 'pages/AcceptInvite'


const UserLayout = (props) => {
  const [ showMenus, setShowMenus ] = useState(false)
  const { path } = useRouteMatch()
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <UserHeader handleShowMenus={() => setShowMenus(true)}/>
      </div>
      <div className={classes.content}>
        <Switch>
          <Route path={`${path}`} component={Planning} exact/>
          <Route path={`${path}/project-accept-invitation/:token`}
            render={(props) => (
              <AcceptInvite {...props} type='project'/>
            )}
          />
          <Route path={`${path}/workspace-accept-invitation/:token`}
            render={(props) => (
              <AcceptInvite {...props} type='workspace'/>
            )}
          />
          <Route component={NotFound}/>
        </Switch>
      </div>

      <div className={classNames(classes.menusMobile, showMenus && classes.show)}>
        <MenusMobile handleCloseMenus={() => setShowMenus(false)}/>
      </div>

    </div>
  )
}

export default UserLayout
