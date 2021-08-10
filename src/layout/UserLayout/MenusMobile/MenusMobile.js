import React from 'react'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import arrowIcon from 'images/arrow.svg'
import closeIcon from 'images/close.svg'
import classNames from 'classnames'
import classes from './MenusMobile.module.scss'

const MenusMobile = ({ handleCloseMenus }) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <a className={classes.btnClose}
          onClick={handleCloseMenus}
        >
          <img src={closeIcon} className={classes.closeIcon} alt='close-icon' />
        </a>
      </div>
      <NavLink to='/cars'
        className={classes.menu}
        activeClassName={classes.active}
        onClick={handleCloseMenus}
      >
        <FormattedMessage id='UserHeader.buyCar'
          defaultMessage='Mua xe'
        />
        <div className={classes.iconWrapper}>
          <img src={arrowIcon} className={classes.icon} alt='icon' />
        </div>

      </NavLink>
      <NavLink to='/products'
        className={classes.menu}
        activeClassName={classes.active}
        onClick={handleCloseMenus}
      >
        <FormattedMessage id='UserHeader.products'
          defaultMessage='Phụ tùng'
        />
        <div className={classes.iconWrapper}>
          <img src={arrowIcon} className={classes.icon} alt='icon' />
        </div>
      </NavLink>
      <NavLink to='/stores'
        className={classes.menu}
        activeClassName={classes.active}
        onClick={handleCloseMenus}
      >
        <FormattedMessage id='UserHeader.stores'
          defaultMessage='SALON'
        />
        <div className={classes.iconWrapper}>
          <img src={arrowIcon} className={classes.icon} alt='icon' />
        </div>
      </NavLink>
      <NavLink to='/insurances'
        className={classes.menu}
        activeClassName={classes.active}
        onClick={handleCloseMenus}
      >
        <FormattedMessage id='UserHeader.insurance'
          defaultMessage='Bảo hiểm'
        />
        <div className={classes.iconWrapper}>
          <img src={arrowIcon} className={classes.icon} alt='icon' />
        </div>
      </NavLink>
      <NavLink to='/services'
        className={classes.menu}
        activeClassName={classes.active}
        onClick={handleCloseMenus}
      >
        <FormattedMessage id='UserHeader.services'
          defaultMessage='Dịch vụ tiện ích'
        />
        <div className={classes.iconWrapper}>
          <img src={arrowIcon} className={classes.icon} alt='icon' />
        </div>
      </NavLink>

      <div className={classes.divider} />
      <NavLink to='/about'
        className={classNames(classes.about, classes.menu)}
        activeClassName={classes.active}
        onClick={handleCloseMenus}
      >
        <FormattedMessage id='UserHeader.about'
          defaultMessage='Về CARCLICK'
        />
        <div className={classes.iconWrapper}>
          <img src={arrowIcon} className={classes.icon} alt='icon' />
        </div>
      </NavLink>

      <div className={classes.langs}>
        <a className={classNames(classes.lang, classes.langActive)}>
          Tiếng Việt
        </a>
        <div className={classes.divider}></div>
        <a className={classNames(classes.lang)}>
          English
        </a>
      </div>
    </div>
  )
}

export default MenusMobile