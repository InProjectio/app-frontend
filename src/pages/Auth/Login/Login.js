import React, { useState } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import {
  Field,
  reduxForm
} from 'redux-form'
import { validateUsername } from 'utils/validators'
import InputField from 'components/InputField'
import classes from './Login.module.scss'
import Button from 'components/Button'
import history from 'utils/history'
import * as Api from 'api/api'
import { Link } from 'react-router-dom'
import * as storage from 'utils/storage'

const messages = defineMessages({
  username: {
    id: 'Login.username',
    defaultMessage: 'Username'
  },
  usernamePlaceholder: {
    id: 'Login.usernamePlaceholder',
    defaultMessage: 'Enter username from 6 - 15 charactors'
  },
  usernameEmpty: {
    id: 'Login.usernameEmpty',
    defaultMessage: 'Please enter your username'
  },
  usernameInvalid: {
    id: 'Login.usernameInvalid',
    defaultMessage: 'Please enter valid username'
  },
  emailInvalid: {
    id: 'Login.emailInvalid',
    defaultMessage: 'Please enter valid email'
  },
  password: {
    id: 'Login.password',
    defaultMessage: 'Password'
  },
  passwordEmpty: {
    id: 'Login.passwordEmpty',
    defaultMessage: 'Please enter your password'
  },

  passwordPlaceholder: {
    id: 'Login.passwordPlaceholder',
    defaultMessage: 'Enter your password'
  }
})

const Login = ({ handleSubmit }) => {
  const [ loading, setLoading ] = useState(false)

  const handleLogin = async (values) => {
    try {
      setLoading(true)
      const firebaseToken = localStorage.getItem('firebaseToken')
      const result = await Api.post({
        url: '/user/sign-in',
        data: {
          ...values,
          firebaseToken
        }
      })
      
      localStorage.setItem('userInfo', JSON.stringify(result.data))
      localStorage.setItem('accessToken', result.data.token)
      localStorage.setItem('companyId', result.data.userMapping?.company)
      storage.login({
        userInfo: JSON.stringify(result.data),
        accessToken: result.data.token,
        companyId: result.data.userMapping?.company
      })
      setLoading(false)
      if (result.data.public_key) {
        history.push('/home')
      } else {
        history.push('/settings/account')
      }
      
    } catch(e) {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)}
      className={classes.container}
    >
      <p className={classes.title}>
        <FormattedMessage id='Login.title'
          defaultMessage='Welcome back!'
        />
      </p>

      <Field name='username'
        component={InputField}
        label={messages.username}
        placeholder={messages.usernamePlaceholder}
        maxLength={15}
        h50={true}
      />

      <Field name='password'
        component={InputField}
        label={messages.password}
        type='password'
        placeholder={messages.passwordPlaceholder}
        h50={true}
      />

      <Button className={classes.btnLogin}
        type='submit'
        loading={loading}
      >
        <FormattedMessage id='Login.login'
          defaultMessage='Login'
        />
      </Button>

      <div className={classes.end}>
        <Link to="/auth/get-link" className={classes.forgotPassword}>
          Forgot password?
        </Link>
      </div>

      <Link to="/auth/register" className={classes.signup}>
        Don’t have an account?
        {' '}
        <span>Sign Up</span>
      </Link>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.username) {
    errors.username = messages.usernameEmpty
  } else if (!validateUsername(values.username)) {
    errors.username = messages.usernameInvalid
  }

  if (!values.password) {
    errors.password = messages.passwordEmpty
  }

  return errors
}

export default reduxForm({
  form: 'Login',
  validate
})(Login)
