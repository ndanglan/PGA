import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { AuthToken, IUser } from '../../../models/userModel';

export interface AuthState {
  auth?: AuthToken;
  user?: IUser;
}

export const setAuthorization = createCustomAction('auth/setAuthorization', (data: AuthToken) => {
  return {
    data
  }
});

export const setUserInfo = createCustomAction('auth/setUserInfo', (data: IUser) => {
  //custom properties on action  trả về object có type:auth/setUserInfo và property data là data truyền vào 
  return {
    data
  }
});

const actions = { setAuthorization, setUserInfo };

type Action = ActionType<typeof actions>;

export default function reducer(state: AuthState = {}, action: Action) {
  switch (action.type) {
    case getType(setAuthorization):
      // hàm getType trong typesafe-actions để lấy type trong object trả về của hàm createCustomAction
      console.log(getType(setAuthorization));
      console.log(action);

      return { ...state, auth: action.data };
    case getType(setUserInfo):
      console.log(getType(setUserInfo));
      console.log(setUserInfo);

      console.log(action);
      return { ...state, user: action.data };
    default:
      return state;
  }
}
