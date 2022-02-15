import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { API_PATHS } from '../../../config/api'
import { AppState } from '../../../redux/reducer'
import { fetchThunk } from '../../common/redux/thunk';
import { IAlbum } from '../../../models/albumModel'
import ListItem from '../components/ListItem'
import { confirmTitle, resetTitle, setAlbum } from '../redux/albumReducer'

type Props = {}

const AlbumPage = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const albumObj = useSelector((state: AppState) => state.album)

  const fetchAlbum = useCallback(
    async () => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(async (dispatch, getState) => {
        const { album } = getState();

        if (album.albums.length > 0) {
          return album.albums;
        }

        const res = await fetch(API_PATHS.album);

        const resData = await res.json();

        return resData
      });

      setLoading(false);

      if (json?.length > 0) {
        const newJson = json.slice(0, 10)
        dispatch(setAlbum(newJson))
        return;
      }

      setErrorMessage("Can't load the data")
    }
    , [dispatch])

  useEffect(() => {
    fetchAlbum();
  }, [])

  return (
    <div className="container mx-auto mt-5 d-flex flex-column" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-end mb-3" style={{ columnGap: '20px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={albumObj.changed ? false : true}
          onClick={(e) => {
            e.preventDefault();
            dispatch(confirmTitle())
          }}
        >
          Confirm
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            dispatch(resetTitle())
          }}
        >
          Reset
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {loading && <div>Loading....</div>}
        {errorMessage && <div>{errorMessage}</div>}
        {albumObj.albums && (
          albumObj.albums.map((album) => (
            <ListItem key={album.id} id={album.id} title={album.title} prevTitle={album.prevTitle} thumbnailUrl={album.thumbnailUrl} changed={true} />
          ))
        )}
      </div>
    </div>
  )
}

export default AlbumPage