import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
// import * as Api from 'api/api'
import GA from 'utils/GoogleAnalytics'
import {
  makeSelectConfirm,
  makeSelectNotification,
  makeSelectShowConfirm
} from './selectors'
import {
  handleHideConfirm,
  hideNotification
} from './actions'
import classes from './CommonLayout.module.scss'
import Notification from '../../components/Notification'
import Confirm from '../../components/Confirm'

import AuthLayout from '../AuthLayout'
import AdminLayout from '../AdminLayout'
import UserLayout from 'layout/UserLayout'
import saga from './saga'
import { injectSaga } from 'utils/injectSaga'
import { getMobileOperatingSystem } from 'utils/utils'
import { getToken } from './actions'
import NotFound from 'pages/NotFound'
import MobilePage from 'pages/MobilePage'
import AdminPrivateRoute from 'routes/AdminPrivateRoute'
import history from 'utils/history'
import {requestFirebaseNotificationPermission} from 'utils/firebaseInit'
import * as storage from 'utils/storage'

const CommonLayout = ({
  notification,
  showConfirm,
  handleHideConfirm,
  confirm,
  hideNotification,
}) => {

  useEffect(() => {
    requestFirebaseNotificationPermission()
    .then((firebaseToken) => {
      // eslint-disable-next-line no-console
      localStorage.setItem('firebaseToken', firebaseToken)
    })
    .catch((err) => {
      console.log('error ==>', err)
      return err;
    });
    const os = getMobileOperatingSystem()
    if (os !== 'unknown' && location.pathname !== '/mobile') {
      history.replace('/mobile')
    }
  }, [])

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        hideNotification()
      }, 8000)
    }

    const handleClickOutside = () => {
      if (notification) {
        hideNotification()
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notification])

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      if ((e.key === 'accessToken' && e.oldValue !== e.newValue)
      ) {
        location.reload()
      }

      if ((e.key === 'walletAddress' && e.oldValue !== e.newValue)
      ) {
        location.reload()
      }
    });
  }, [])

  /**
   * listen initial storage when open
   */
  useEffect(() => {
    storage.getAllStorage()
    window.addEventListener('message', messageHandler, false);
    function messageHandler(event) {
      const { action, key, value } = event.data
      if (action === 'returnData') {
        const oldAccessToken = localStorage.getItem('accessToken')
        if (key === 'getAllStorage') {
          localStorage.setItem('userInfo', value.userInfo)
          localStorage.setItem('accessToken', value.accessToken)
          if (value.companyId) {
            localStorage.setItem('companyId', value.companyId)
          }
          
          if (oldAccessToken !== value.accessToken) {
            location.reload()
          }
        }
      }
    }
  }, [])

  

  return (
    <div className={classes.container}>
      {
        notification
        && <Fade top
          duration={500}
        >
          <div className={classes.notification}>
            <Notification notification={notification} />
          </div>
        </Fade>
      }
      { GA.init() && <GA.RouteTracker /> }
      <Switch>
        <Route path='/mobile' component={MobilePage} />
        <Route path='/auth' component={AuthLayout}/>
        <Route path='/user' component={UserLayout} />
        <AdminPrivateRoute path='/' component={AdminLayout}/>
        <Route component={NotFound}/>
      </Switch>
      <Modal show={showConfirm}
        onHide={handleHideConfirm}
        centered
      >
        <Confirm handleClose={handleHideConfirm}
          confirmData={confirm}
        />
      </Modal>
    </div>
  )
}

const withSaga = injectSaga({ key: 'global', saga });

const ComposeCommonLayout = compose(withSaga)(CommonLayout)

const mapStateToProps = createStructuredSelector({
  showConfirm: makeSelectShowConfirm(),
  notification: makeSelectNotification(),
  confirm: makeSelectConfirm()
})

function mapDispatchToProps(dispatch) {
  return {
    handleHideConfirm: () => dispatch(handleHideConfirm()),
    hideNotification: () => dispatch(hideNotification()),
    getToken: () => dispatch(getToken()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeCommonLayout)
