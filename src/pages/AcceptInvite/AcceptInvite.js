import React, { useEffect, useState } from 'react'
import * as Api from 'api/api'
import Button from 'components/Button'
import classNames from 'classnames'
import history from 'utils/history'
import invited from 'images/invited.svg'
import classes from './AcceptInvite.module.scss'

const AcceptInvite = ({ match, type }) => {
  const [ success, setSuccess ] = useState(true)
  const accessToken = localStorage.getItem('accessToken')
  useEffect(async () => {
    try {
      if (type === 'project') {
        await Api.get({
          url: `/project/accept-invitation`,
          params: {
            token: match.params.token
          }
        })
      } else {
        await Api.get({
          url: `/workspace/accept-invitation`,
          params: {
            token: match.params.token
          }
        })
      }
      setSuccess(true)
    } catch(e) {
      setSuccess(false)
    }
   
  }, [])


  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <img src={invited} className={classes.invited} alt="invited" />
        <h2 className={classes.title}>
          {success ? 'You have accepted invite' : 'Request expired, please contact with admin'}
        </h2>
        <Button
          className={classNames('btn btnPurple btnLarge', classes.center)}
          onClick={() => {
            if (accessToken) {
              history.push('/home')
            } else {
              history.push('/auth/login')
            }
          }}
        >
          { accessToken ? 'Dashboard' : 'Login' }
        </Button>
      </div>
    </div>
  )
}

export default AcceptInvite
