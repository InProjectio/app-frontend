import React from 'react'
import SocialLogin from 'react-social-login'
import classNames from 'classnames'
import classes from './SocialButton.module.scss'

class Button extends React.Component {
  render() {
    const { triggerLogin, customClass, children, ...rest } = this.props
    return (
      <button onClick={triggerLogin}
        {...rest}
        className={classNames(classes.btn, customClass)}
        type='button'
      >
        { children }
      </button>
    )
  }
}

export default SocialLogin(Button)
