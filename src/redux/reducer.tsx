import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';

export interface AppState {
  profile: AuthState;
}

export default function createRootReducer(history: History) {
  return combineReducers({
    // để quản lý router trong redux
    router: connectRouter(history),
    profile: authReducer,
  });
}