import { ActionType, createCustomAction, getType } from "typesafe-actions";
import { IAlbum } from "../../../models/albumModel";
export interface AlbumState {
  albums: IAlbum[],
  changed: boolean,
}

export const setAlbum = createCustomAction('album/setAlbum', (data: IAlbum[]) => {
  return {
    data
  }
});

export const resetTitle = createCustomAction('album/resetTitle')

export const activeChange = createCustomAction('album/activeChange')

const actions = { setAlbum, resetTitle, activeChange };

type Action = ActionType<typeof actions>;

export default function reducer(state: AlbumState = {
  albums: [],
  changed: false
}, action: Action) {
  switch (action.type) {
    case getType(setAlbum): {
      // hàm getType trong typesafe-actions để lấy type trong object trả về của hàm createCustomAction
      return { ...state, albums: action.data, changed: true };
    }
    case getType(resetTitle): {
      return { ...state, changed: false }
    }
    case getType(activeChange): {
      return {
        ...state, changed: true
      }
    }
    default:
      return state;
  }
}
