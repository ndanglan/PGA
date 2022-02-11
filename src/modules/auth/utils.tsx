import { ILoginParams, ILoginValidation } from "../../models/loginModel";

const validEmailRegex =
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = (email: string) => {
  if (!email) {
    return 'Email is required!'
  }

  if (!validEmailRegex.test(email)) {
    return 'Email is invalid!'
  }

  return '';
}

export const validatePassword = (password: string) => {
  if (!password) {
    return 'Password is required!'
  }

  if (password.length < 4) {
    return 'Password needs at least 4 number!'
  }

  return '';
}

export const validateLogin = (values: ILoginParams): ILoginValidation => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password)
  }
}

export const validLogin = (values: ILoginValidation) => {
  return !values.email && !values.password
}