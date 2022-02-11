import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../../../assets/img/logo.jpg';
import { ILoginParams } from '../../../models/loginModel';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../config/api';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { Action } from 'typesafe-actions';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { getErrorMessageResponse } from '../../../utils';

const LoginPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('')
  const onLogin = async (values: ILoginParams) => {
    setErrorMessage('');
    setLoading(true);

    const json = await dispatch(
      fetchThunk(API_PATHS.signIn, 'post', {
        email: values.email,
        password: values.password
      }))

    setLoading(false)

    if (json?.code === RESPONSE_STATUS_SUCCESS) {
      Cookies.set(ACCESS_TOKEN_KEY, json.data.token, { expires: values.rememberMe ? 7 : undefined });
      console.log(json);

      return;
    }

    setErrorMessage(getErrorMessageResponse(json))
  }
  return <div
    className="container d-flex flex-column justify-content-md-center align-items-md-center"
    style={{ height: "100vh" }}>
    <img
      src={logo}
      alt="logo"
      style={{ maxWidth: '250px', margin: '32px' }}
    />
    <LoginForm onLogin={onLogin} loading={loading} errorMessage={errorMessage} />
  </div>;
};

export default LoginPage;
