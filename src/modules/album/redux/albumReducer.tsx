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

export const setTitleValue = createCustomAction('album/setTitleValue', (data: string, id: number) => {
  return {
    data,
    id
  }
});

export const confirmTitle = createCustomAction('album/confirmTitle')

export const resetTitle = createCustomAction('album/resetTitle')

const actions = { setAlbum, setTitleValue, confirmTitle, resetTitle };

type Action = ActionType<typeof actions>;

export default function reducer(state: AlbumState = {
  albums: [],
  changed: false
}, action: Action) {
  switch (action.type) {
    case getType(setAlbum): {
      // hàm getType trong typesafe-actions để lấy type trong object trả về của hàm createCustomAction
      const newArr = action.data.map((album: IAlbum) => {
        return {
          id: album.id,
          title: album.title,
          prevTitle: album.title,
          changed: false,
          thumbnailUrl: album.thumbnailUrl
        }
      })
      return { ...state, albums: newArr };
    }

    case getType(setTitleValue): {
      const newArr = state.albums.map((album: IAlbum) => {
        if (album.id === action.id) {

          if (album.prevTitle !== action.data) {
            state.changed = true
            return {
              ...album,
              title: action.data,
              changed: true
            }
          } else {
            state.changed = false
            return {
              ...album,
              title: action.data,
              changed: false
            }
          }
        }

        return {
          ...album
        }
      })

      return {
        ...state,
        albums: newArr
      }
    }

    case getType(confirmTitle): {
      state.changed = false;
      const newArr = state.albums.map(album => {
        return {
          ...album,
          prevTitle: album.title
        }
      })

      return {
        ...state,
        changed: state.changed,
        albums: newArr
      }
    }

    case getType(resetTitle): {
      state.changed = false;
      const newArr = state.albums.map(album => {
        if (album.title !== album.prevTitle) {
          return {
            ...album,
            title: album.prevTitle
          }
        }

        return album
      })

      return {
        ...state,
        changed: state.changed,
        albums: newArr
      }
    }

    default:
      return state;
  }
}
