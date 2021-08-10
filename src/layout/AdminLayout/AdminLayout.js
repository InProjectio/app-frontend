import React, { useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import {
  Switch,
  useRouteMatch,
  Route
} from 'react-router-dom'
import plusIcon from 'images/plus-white.svg'
import { compose } from 'redux'
import classes from './AdminLayout.module.scss'
import SideBar from '../../components/SideBar'
import Header from '../../components/Header'
import AdminPrivateRoute from 'routes/AdminPrivateRoute'
import Home from 'pages/Admin/Home'
import CreateTask from 'components/CreateTask'
import ManageTask from 'pages/Admin/ManageTask'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import {
  handleCloseTaskForm,
  handleShowTaskForm,
  getSpaces,
  getLabels,
  getNotification
} from './slices'
import {
  selectShowTaskForm,
  selectSelectedTask,
  selectSelectedPhase,
  selectNotification
} from './selectors'
import { FormattedMessage } from 'react-intl'
import MyAccount from 'pages/Admin/MyAccount'
import Notifications from 'pages/Admin/Notifications'
import ChangePassword from 'pages/Admin/ChangePassword/ChangePassword'
import { injectSaga } from 'utils/injectSaga'
import saga from './sagas'
import { showNotification } from 'layout/CommonLayout/actions'
import {onMessageListener} from 'utils/firebaseInit'
import { convertParamsFromPathname } from 'utils/utils'

const AdminLayout = (props) => {
  // console.log(props)
  const { handleCloseTaskForm, showTaskForm, selectedTask, handleShowTaskForm, getSpaces,
    getLabels,
    selectedPhase,
    showNotification,
    getNotification,
    notification,
    location
  } = props
  const { path } = useRouteMatch()

  // console.log(props)

  useEffect(() => {
    const { taskId,
      taskName,
      phaseId,
      phaseName } = convertParamsFromPathname(location.pathname)
    if (taskId) {
      handleShowTaskForm({
        folder_id: phaseId,
        folder_name: phaseName
      }, {
        task_id: taskId,
        task_name: taskName
      })
    }
  }, [])

  const spaceId = useMemo(() => {
    const { spaceId } = convertParamsFromPathname(location.pathname)
    return spaceId
  }, [location.pathname])

  /**
   * state quản lý việc show menu hay không
   */
  const [showMenu, setShowMenu] = useState('FULL')
  const [noTransition, setNoTransition ] = useState(true)
  const [ showMenuClass, setShowMenuClass ] = useState(false)


  useEffect(() => {
   
    onMessageListener()
    .then((payload) => {
      console.log(payload)
      const notification = new Notification(payload.data.title, {
        body: payload.data.body,
      })
      notification.onclick = function () {
        window.open("http://google.com");
      };
    })
    setShowMenu(localStorage.getItem('showMenu') || 'FULL')
  }, [])

  

  useEffect(() => {
    getSpaces()
    getNotification()
  }, [])

  useEffect(() => {
    if (spaceId) {
      getLabels(spaceId)
    }
   
  }, [spaceId])

  /**
   * xử lý toggle menu
   */
  const handleToggleMenu = () => {
    let newShowMenu = null
    if (showMenu === 'FULL' || !showMenu) {
      newShowMenu = 'COLLAPSE'
    } else if (showMenu === 'COLLAPSE') {
      newShowMenu = 'FULL'
    }
    localStorage.setItem('showMenu', newShowMenu)
    setShowMenu(newShowMenu)
    setNoTransition(false)
  }

  /**
   * xử lý show menu
   */
  const handleShowMenuMobile = () => {
    setShowMenuClass(true)
  }

  /**
   * xử lý hide menu
   */
  const handleHideMenuMobile = () => {
    setShowMenu(false)
    setTimeout(() => {
      setShowMenuClass(false)
    }, 400)
  }

  return (
    <div className={classNames(classes.container)}
      id="outer-container"
    >
      {/* <div className={classNames(classes.sideBarMobile, showMenuClass && classes.sideBarShow)}>
        <SideBar mobile={true}
          handleHideMenu={handleHideMenuMobile}
          screen={screen}
          showMenu={true}
          pathname={props.location.pathname}
        />
      </div>
      {(showMenuClass)
        && <div className={classNames('fade modal-backdrop show', classes.backdrop)} />
      } */}

      <div className={classNames(classes.sideBar, showMenu === 'COLLAPSE' && classes.sideBarCollapseWrapper)}>
        <SideBar {...props}
          screen={screen}
          showMenu={!!showMenu}
          collapse={showMenu === 'COLLAPSE'}
          handleToggleMenu={handleToggleMenu}
          pathname={props.location.pathname}
          notification={notification}
        />
      </div>

      
      <div className={classes.content}>
        <div className={classNames(classes.header, showMenu === 'COLLAPSE' && classes.headerCollapse)}>
          <Header
            {...props}
            showMenu={true}
            handleShowMenuMobile={handleShowMenuMobile}
            handleHideMenu={handleHideMenuMobile}
            handleToggleMenu={handleToggleMenu}
            collapse={showMenu === 'COLLAPSE'}
            showMenuClass={showMenuClass}
            showNotification={showNotification}
          />
        </div>
        <div className={classNames(classes.main,
          showMenu === 'FULL' && classes.showMenu,
          showMenu === 'COLLAPSE' && classes.showMenuCollapse,
          noTransition && classes.noTransition)}
          id="page-wrap"
        >
          <Switch>
            <AdminPrivateRoute path={`${path}`} component={Home} exact/>
            <AdminPrivateRoute path={`${path}home`} component={Home} exact/>
            <AdminPrivateRoute path={`${path}settings/account`} component={MyAccount}/>
            <AdminPrivateRoute path={`${path}settings/change-password`} component={ChangePassword}/>
            <AdminPrivateRoute path={`${path}notifications/new`}>
              <Notifications status='new'
                {...props}
              />
            </AdminPrivateRoute>
            <AdminPrivateRoute path={`${path}notifications/cleared`}>
              <Notifications status='cleared'
                {...props}
              />
            </AdminPrivateRoute>
            <Route path={`${path}:space`}
              render={(props) => (
                <ManageTask showMenu={showMenu} {...props}/>
              )}
            />
            <Route path={`${path}:space/:project`}
              render={(props) => (
                <ManageTask showMenu={showMenu} {...props}/>
              )}
            />
            <Route path={`${path}:space/:project/:phase`}
              render={(props) => (
                <ManageTask showMenu={showMenu} {...props}/>
              )}
            />
          </Switch>
        </div>
      </div>

      {showTaskForm
        && <CreateTask handleClose={handleCloseTaskForm}
        show={showTaskForm}
        selectedTask={selectedTask}
        selectedPhase={selectedPhase}
      />
      }
      

      <a className={classes.btnCreateTask}
        onClick={() => handleShowTaskForm()}
      >
        <img src={plusIcon} className={classes.plusIcon} alt='icon'/>
        <FormattedMessage id='AdminLayout.task'
          defaultMessage='Task'
        />
      </a>
    </div>
  )
}

const withSaga = injectSaga({ key: 'adminGlobal', saga });

const ComposeAdminLayout = compose(withSaga)(AdminLayout)

const mapStateToProps = createStructuredSelector({
  showTaskForm: selectShowTaskForm(),
  selectedTask: selectSelectedTask(),
  selectedPhase: selectSelectedPhase(),
  notification: selectNotification()
})

const mapDispatchToProps = {
  handleCloseTaskForm,
  handleShowTaskForm,
  getSpaces,
  getLabels,
  showNotification,
  getNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeAdminLayout)
