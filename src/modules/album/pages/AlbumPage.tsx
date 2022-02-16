import { push } from 'connected-react-router'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { API_PATHS } from '../../../config/api'
import { ROUTES } from '../../../config/routes'
import { IAlbum } from '../../../models/albumModel'
import { AppState } from '../../../redux/reducer'
import ListItem from '../components/ListItem'
import { setAlbum } from '../redux/albumReducer'

const AlbumPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const albumObj = useSelector((state: AppState) => state.album);
  const [albums, setAlbums] = useState<IAlbum[]>(albumObj.albums);
  const [changed, setChanged] = useState(false);

  const fetchAlbum = useCallback(
    async () => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(async (dispatch, getState) => {
        const { album } = getState();
        console.log(album.albums.length);

        if (album.albums.length > 0) {
          const newAlbums = album.albums.map(item => {
            return {
              ...item,
              prevTitle: item.title
            }
          })
          return newAlbums
        }

        const res = await fetch(API_PATHS.album);

        const resData = await res.json();

        return resData
      });

      setLoading(false);

      if (json?.length > 0) {
        const newJson = json.slice(0, 10).map((item: IAlbum) => {
          return {
            ...item,
            prevTitle: item.title
          }
        })
        dispatch(setAlbum(newJson))
        setAlbums(newJson)
        return;
      }
    }
    , [dispatch]);

  const onChange = useCallback((title: string, id: number) => {
    setAlbums((prev: IAlbum[]) => {
      let check = false;
      const newArr = prev.map(album => {
        if (album.id === id) {
          if (album.title !== title) {
            // setChanged(true);
            album.title = title;
          }
        }
        if (album.title !== album.prevTitle) {
          check = true;
        }
        return album
      });
      setChanged(check);

      return newArr;
    })

  }, []);

  const onConfirm = (list: IAlbum[]) => {
    const newList = list.map(album => {
      if (album.prevTitle !== album.title) {
        album.prevTitle = album.title;
      }
      return album
    })

    dispatch(setAlbum(newList))
    setChanged(false);
  }

  const onReset = (list: IAlbum[]) => {
    const newList = list.map(album => {
      if (album.prevTitle !== album.title && !!(album.prevTitle)) {
        album.title = album.prevTitle;
      }
      return album
    })

    dispatch(setAlbum(newList))
    setChanged(false);
  }

  useEffect(() => {
    fetchAlbum();
  }, [])

  return (
    <div className="container mx-auto mt-5 d-flex flex-column" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-end mb-3" style={{ columnGap: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={() => {
          dispatch(push(ROUTES.home))
        }}>
          <FormattedMessage id="backTohome" />
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            onConfirm(albums)
          }}
          disabled={changed ? false : true}
        >
          <FormattedMessage id="confirm" />
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            onReset(albums)
          }}
        >
          <FormattedMessage id="reset" />
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {loading && <div>Loading....</div>}
        {errorMessage && <div>{errorMessage}</div>}
        {albums.length > 0 && (
          albums.map((album, index) => (
            <ListItem
              key={index}
              id={album.id}
              title={album.title}
              prevTitle={album?.prevTitle}
              thumbnailUrl={album.thumbnailUrl}
              changed={true}
              onChange={onChange}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default memo(AlbumPage)