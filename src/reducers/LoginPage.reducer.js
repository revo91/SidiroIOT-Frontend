import { SET_LOGIN_FORM_USERNAME, SET_LOGIN_FORM_PASSWORD, SET_LOGIN_FORM_USERNAME_ERROR, SET_LOGIN_FORM_PASSWORD_ERROR } from '../actions/LoginPage.action';

const initialState = {
  username: '',
  usernameError: false,
  password: '',
  passwordError: false
}

export const LoginPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_FORM_USERNAME:
      return {
        ...state,
        username: action.username,
      }
    case SET_LOGIN_FORM_PASSWORD:
      return {
        ...state,
        password: action.password
      }
    case SET_LOGIN_FORM_USERNAME_ERROR:
      return {
        ...state,
        usernameError: action.error
      }
    case SET_LOGIN_FORM_PASSWORD_ERROR:
      return {
        ...state,
        passwordError: action.error
      }
    default:
      return state
  }
}