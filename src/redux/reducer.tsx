import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';

export interface AppState {
  profile: AuthState;
  // router: RouterState
}

export default function createRootReducer() {
  return combineReducers({
    // để quản lý router trong redux
    // router: connectRouter(history),
    profile: authReducer,
  });
}