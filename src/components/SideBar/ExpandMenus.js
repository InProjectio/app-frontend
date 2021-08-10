import React, { Component, useState } from 'react'
import classNames from 'classnames'
import { injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import Expand from 'react-expand-animated';
import downIcon from 'images/arrow-white.svg'
import classes from './SideBar.module.scss'

const ExpandMenus = ({
  active,
  menu,
  subMenus,
  intl,
  collapse,
}) => {
  const [openSubMenus, setOpenSubMenus] = useState(active)
  
  return (
    <div className={classNames(collapse && classes.expandMenuCollapse)}>
      <a className={classNames(classes.menuItem, openSubMenus && classes.expandMenuActive)}
        onClick={() => setOpenSubMenus((prevOpenSubMenus) => !prevOpenSubMenus)}
      >
        <div className={classes.iconWrapper}>
          <img className={classNames(classes.img, menu.iconStyle)}
            src={menu.image}
            alt='img-sidebar'
          />
        </div>

        <span>{intl.formatMessage(menu.label)}</span>
        <img src={downIcon}
          alt='down'
          className={classNames(classes.icon, openSubMenus ? classes.iconUp : classes.iconDown)}
        />
      </a>
      <Expand open={openSubMenus}
        duration={300}
      >
        <div className={classes.subMenus}>
          {subMenus && subMenus.map((item) => (
            <div key={item.value}>
              { !item.hide
                && <NavLink to={item.href}
                  className={classNames(classes.menuItem)}
                  activeClassName={classes.active}
                >
                  <p className={classes.text}>
                    {intl.formatMessage(item.label)}
                  </p>
                </NavLink>
              }

            </div>
          ))}
        </div>
      </Expand>
    </div>
  )
}


export default injectIntl(ExpandMenus)
