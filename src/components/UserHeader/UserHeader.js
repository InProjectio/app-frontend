import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import classNames from 'classnames'
import classes from './UserHeader.module.scss'
import { FormattedMessage } from 'react-intl'
import MenuButton from 'components/Header/MenuButton'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import logo from 'images/logo.png'
import Dropdown from '../Dropdown'
import Avatar from '../Header/Avatar'
import history from 'utils/history'

const UserHeader = (props) => {
  const { handleShowMenus,
    showPopup,
    closePopup,
  } = props
  const [isLoggedIn] = useState(localStorage.getItem('accessToken'))
  const [userInfo] = useState(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {})
  const popupRef = useRef(null)


  useEffect((e) => {
    const handleClickOutside = (e) => {
      // console.log(popupRef.current && popupRef.current.contains(e.target), e.target, showPopup)
      if (popupRef && popupRef.current && !popupRef.current.contains(e.target) && showPopup) {
        closePopup()
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPopup])
  
  const handleLogout = () => {
    localStorage.clear()
    history.push('/auth/login')
  }

  return (
    <div className={classes.container}>
      <div className={classes.btnMenuMobile}>
        <MenuButton handleToggleMenu={handleShowMenus}
          active={false}
          color={'white'}
        />
      </div>
      <div className={classes.left}>
        <NavLink to='/'>
          <div className={classes.logoWrapper}>
            <img src={logo} className={classes.logo} alt='logo' />
          </div>
        </NavLink>
      </div>
      <div className={classes.menus}>
        <NavLink to='/product'
          className={classes.menu}
          activeClassName={classes.active}
        >
          <FormattedMessage id='UserHeader.product'
            defaultMessage='Product'
          />
        </NavLink>
        <NavLink to='/learn'
          className={classes.menu}
          activeClassName={classes.active}
        >
          <FormattedMessage id='UserHeader.learn'
            defaultMessage='Learn'
          />
        </NavLink>
        <NavLink to='/pricing'
          className={classes.menu}
          activeClassName={classes.active}
        >
          <FormattedMessage id='UserHeader.pricing'
            defaultMessage='Pricing'
          />
        </NavLink>
        <NavLink to='/contact-sales'
          className={classes.menu}
          activeClassName={classes.active}
        >
          <FormattedMessage id='UserHeader.contactSales'
            defaultMessage='Contact sales'
          />
        </NavLink>

      </div>
      <div className={classes.right}>
        {isLoggedIn
          ? <Dropdown mainComponent={
            <div className={classes.userName}
            >
              <p className={classes.name}>
                {userInfo.fullname || userInfo.username}
              </p>
              <Avatar avatar={userInfo.avatar_url} />

            </div>
          }
            childrenComponent={() => (
              <div className={classes.dropdownMenu}>
                <Link className={classes.dropdownMenuItem} to='/home'>
                  Dashboard
                </Link>
                <div className={classes.dropdownMenuItem}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          />
          : <div className={classes.actions}>
            <NavLink to='/auth/login'
              className={classNames(classes.btn)}
            >
              <FormattedMessage id='UserHeader.login'
                defaultMessage='Login'
              />
            </NavLink>
            <NavLink to='/auth/register'
              className={classNames(classes.btn, classes.btnRegister)}
            >
              <FormattedMessage id='UserHeader.register'
                defaultMessage='Sign up'
              />
            </NavLink>
          </div>
        }


      </div>
    </div>
  )
}

const mapStateToProps = createStructuredSelector({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UserHeader)
