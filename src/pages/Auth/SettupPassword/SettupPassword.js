import React, { useState } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import {
  Field,
  reduxForm
} from 'redux-form'
import InputField from 'components/InputField'
import classes from './SettupPassword.module.scss'
import Button from 'components/Button'
import { convertSearchParamsToObject } from 'utils/utils'
import * as Api from 'api/api'
import history from 'utils/history'

const messages = defineMessages({
  password: {
    id: 'SettupPassword.password',
    defaultMessage: 'New password'
  },
  confirmPassword: {
    id: 'SettupPassword.confirmPassword',
    defaultMessage: 'Confirm password'
  },
  passwordEmpty: {
    id: 'SettupPassword.passwordEmpty',
    defaultMessage: 'Please enter password'
  },
  passwordPlaceholder: {
    id: 'SettupPassword.passwordPlaceholder',
    defaultMessage: 'Enter password'
  },
  confirmPasswordPlaceholder: {
    id: 'SettupPassword.confirmPasswordPlaceholder',
    defaultMessage: 'Confirm password'
  },
  passwordNotMatch: {
    id: 'SettupPassword.passwordNotMatch',
    defaultMessage: 'Password and confirm password not match'
  }
})

const SettupPassword = ({ handleSubmit, location }) => {
  const [loading, setLoading] = useState()

  
  const handleChangePassword = async (values) => {
    const { token } = convertSearchParamsToObject(location.search)
    try {
      setLoading(true)
      await Api.post({
        url: '/user/update-password',
        data: {
          ...values,
          token
        }
      })
      history.push('/auth/login')
      setLoading(false)
    } catch(e) {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleChangePassword)}
      className={classes.container}
    >
      <p className={classes.title}>
        <FormattedMessage id='SettupPassword.title'
          defaultMessage='Change password'
        />
      </p>

      <Field name='password'
        component={InputField}
        label={messages.password}
        type='password'
        placeholder={messages.passwordPlaceholder}
        h50={true}
      />

      <Field name='confirmPassword'
        component={InputField}
        label={messages.confirmPassword}
        type='password'
        placeholder={messages.confirmPasswordPlaceholder}
        h50={true}
      />

      <Button className={classes.btnChangePassword}
        type='submit'
        loading={loading}
      >
        <FormattedMessage id='SettupPassword.changePassword'
          defaultMessage='Change password'
        />
      </Button>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.password) {
    errors.password = messages.passwordEmpty
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = messages.passwordEmpty
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = messages.passwordNotMatch
  }

  return errors
}

export default reduxForm({
  form: 'SettupPassword',
  validate
})(SettupPassword)
