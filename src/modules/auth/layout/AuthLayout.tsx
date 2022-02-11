import React from 'react'
import logo from '../../../assets/img/logo.jpg';

interface Props {
  children: React.ReactNode
}

const AuthLayout = (props: Props) => {
  return (
    <div className="container d-flex flex-column justify-content-md-center align-items-md-center"
      style={{ minHeight: "100vh" }}>
      <img src={logo} alt="logoPGA" style={{ maxWidth: '250px', margin: '32px' }} />
      {props.children}
    </div>
  )
}

export default AuthLayout