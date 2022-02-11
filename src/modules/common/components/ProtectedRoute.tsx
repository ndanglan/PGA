import Cookies from 'js-cookie';
import React from 'react'
import { Navigate, Outlet, RouteProps } from 'react-router-dom'
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';

interface Props extends RouteProps { }

const ProtectedRoute = (props: Props) => {
  const auth = Cookies.get(ACCESS_TOKEN_KEY);

  if (auth) {
    // OUtlet component = this.props.children
    return <Outlet />
  }

  return (
    <Navigate to="/login" />
  )
}

export default ProtectedRoute