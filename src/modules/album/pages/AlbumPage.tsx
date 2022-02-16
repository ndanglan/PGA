import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { API_PATHS } from '../../../config/api'
import { IAlbum } from '../../../models/albumModel'
import { AppState } from '../../../redux/reducer'
import ListItem from '../components/ListItem'
import { activeChange, resetTitle, setAlbum } from '../redux/albumReducer'

interface UpdatedList {
  id: number,
  title: string
}

const AlbumPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const albumObj = useSelector((state: AppState) => state.album);
  const [albums, setAlbums] = useState<IAlbum[]>(albumObj.albums);
  const [listChangedAlbum, setListChangedAlbum] = useState<UpdatedList[]>([])
  const [changed, setChanged] = useState(false);
  const [reset, setReset] = useState(false);

  const fetchAlbum = useCallback(
    async () => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(async (dispatch, getState) => {
        const { album } = getState();

        if (album.albums.length > 0) {
          const newAlbums = [
            ...album.albums
          ]
          return newAlbums
        }

        const res = await fetch(API_PATHS.album);

        const resData = await res.json();

        return resData
      });

      setLoading(false);

      if (json?.length > 0) {
        const newJson = json.slice(0, 10)
        dispatch(setAlbum(newJson))
        setAlbums(newJson)
        return;
      }
    }
    , [dispatch]);

  const onChange = useCallback((title: string, id: number) => {

    setListChangedAlbum((prev) => {
      const newArr = prev.slice(0);
      const indexExist = prev.findIndex(item => item.id === id);

      if (indexExist < 0) {
        newArr.push({
          id: id,
          title: title
        })
      } else {
        newArr[indexExist].title = title;
      }
      return newArr
    })
  }, []);

  const onConfirm = (list: UpdatedList[]) => {
    const newList = albums.map(album => {
      const updatedAlbum = list.find(item => item.id === album.id);

      if (updatedAlbum) {
        return {
          ...album,
          title: updatedAlbum.title
        }
      }

      return album
    })



    dispatch(setAlbum(newList))
    setListChangedAlbum([]);
  }

  const onReset = () => {
    setListChangedAlbum([]);
    if (albumObj.changed) {
      dispatch(resetTitle())
    }
  }

  useEffect(() => {
    fetchAlbum();
  }, [])

  useEffect(() => {
    console.log(listChangedAlbum);

  }, [listChangedAlbum])

  return (
    <div className="container mx-auto mt-5 d-flex flex-column" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-end mb-3" style={{ columnGap: '20px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            onConfirm(listChangedAlbum)
          }}
          disabled={listChangedAlbum.length !== 0 ? false : true}
        >
          Confirm
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            onReset()
          }}
        >
          Reset
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {loading && <div>Loading....</div>}
        {errorMessage && <div>{errorMessage}</div>}
        {albums.length > 0 && (
          albums.map((album) => (
            <ListItem
              key={album.id}
              id={album.id}
              title={album.title}
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

export default AlbumPage