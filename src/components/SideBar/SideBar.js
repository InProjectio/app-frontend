import React, { Component } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage} from 'react-intl'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
// import { push as Menu } from 'react-burger-menu'
import PerfectScrollbar from 'react-perfect-scrollbar'
import homeIcon from 'images/sidebar/home.png'
import notificationIcon from 'images/sidebar/bell.png'
import logo from 'images/sidebar/logo.png'
import logoMobile from 'images/sidebar/logo-mobile.png'
import linkedin from 'images/icons8-linkedin.svg'
import twitter from 'images/icons8-twitter.svg'
import facebook from 'images/icons8-facebook.svg'
import youtube from 'images/icons8-youtube_play_button.svg'
import classes from './SideBar.module.scss'
import Spaces from './Spaces'
import marketPlaceIcon from 'images/marketplace.svg'

export default class SideBar extends Component {
  render() {
    const { collapse,
      notification
    } = this.props
    

    return (
      <div className={classNames(classes.wrapper, collapse && classes.wrapperCollapse, collapse && classes.collapse)}>
      <PerfectScrollbar
        className={classNames(classes.container)}
          options={{ wheelPropagation: false }}
      >
        <div className={classes.menuContainer}>
          <div className={classes.logoWrapper}>
            <img src={logo} className={classes.logo} alt='logo'/>
            <img src={logoMobile} className={classes.logoMobile} alt='logo'/>
          </div>
          
          <NavLink to='/'
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
            exact
          >
            <div className={classes.iconWrapper}>
              <img src={homeIcon}
                alt='icon'
                className={classes.homeIcon}
              />
            </div>
            <span>
              <FormattedMessage id='SideBar.home'
                defaultMessage='Home'
              />
            </span>

          </NavLink>

          <NavLink to='/notifications/new'
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img src={notificationIcon}
                alt='icon'
                className={classes.listIcon}
              />
            </div>
            <span className={classes.menuTitle}>
              <FormattedMessage id='SideBar.notification'
                defaultMessage='Notification'
              />
            </span>
            { notification?.pageInfo?.count > 0
              &&  <div className={classes.numberNotifications}>
                {notification?.pageInfo?.count}
              </div>
            }
           
          </NavLink>
          
          <Spaces
            {...this.props}
            handleShowCreateProject={this.handleShowCreateProject}
            handleShowCreatePhase={this.handleShowCreatePhase}
            collapse={collapse}
          />

          <div className={classes.space} />
          </div>
          
      </PerfectScrollbar>
      <div className={classes.bottom}>
        <a className={classNames(classes.btn, 'btn btnSmall btnPurple')}
          onClick={() => {
            window.open('https://auction.inproject.io')
          }}
        >
            <img src={marketPlaceIcon} className={classes.marketPlaceIcon} alt='icon'/>
            <span>
              Marketplace
            </span>
          </a>
        <div className={classes.socials}>
          <a className={classes.social}>
            <img src={linkedin} className={classes.icon} alt="icon" />
          </a>
          <a className={classes.social}>
            <img src={facebook} className={classes.icon} alt="icon" />
          </a>
          <a className={classes.social}>
            <img src={twitter} className={classes.icon} alt="icon" />
          </a>
          <a className={classes.social}>
            <img src={youtube} className={classes.icon} alt="icon" />
          </a>
        </div>
        <p className={classes.copyright}>
          © 2021, InProject All rights reserved.
        </p>
      </div>
      </div>
    )
  }
}
