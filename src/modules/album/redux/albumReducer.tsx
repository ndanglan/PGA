import { ActionType, createCustomAction, getType } from "typesafe-actions";
import { IAlbum } from "../../../models/albumModel";

export interface AlbumState {
  details?: IAlbum[]
}

export const setAlbum = createCustomAction('auth/setAlbum', (data: AlbumState) => {
  return {
    data
  }
});


const actions = { setAlbum };

type Action = ActionType<typeof actions>;

export default function reducer(state: AlbumState = {}, action: Action) {
  switch (action.type) {
    case getType(setAlbum):
      // hàm getType trong typesafe-actions để lấy type trong object trả về của hàm createCustomAction

      return { ...state, details: action.data };
    default:
      return state;
  }
}
