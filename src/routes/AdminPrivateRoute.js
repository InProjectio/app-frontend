import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from 'utils/utils'

const AdminPrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={(props) => {
      if (isLoggedIn()) {
        return <Component {...rest} {...props} />
      } else {
        return <Redirect to={`/auth/login?redirect=${window.location.pathname}${window.location.search}`}/>
      }
    }}
  />
)

export default AdminPrivateRoute
