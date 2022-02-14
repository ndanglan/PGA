import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { API_PATHS } from '../../../config/api'
import { AppState } from '../../../redux/reducer'
import { fetchThunk } from '../../common/redux/thunk';
import { IAlbum } from '../../../models/albumModel'
import ListItem from '../components/ListItem'

type Props = {}

const AlbumPage = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [albums, setAlbums] = useState<IAlbum[]>([])

  const fetchAlbum = useCallback(
    async () => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(
        fetchThunk(API_PATHS.album)
      );

      setLoading(false);

      if (json?.length > 0) {
        setAlbums(json);
        return;
      }

      setErrorMessage("Can't lose the data")
    }
    , [dispatch])

  useEffect(() => {
    fetchAlbum();
  }, [])

  return (
    <div className="container mx-auto mt-5 d-flex flex-column" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-end mb-3" style={{ columnGap: '20px' }}>
        <button type="button" className="btn btn-secondary">
          Confirm
        </button>
        <button type="button" className="btn btn-secondary">
          Reset
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {loading && <div>Loading....</div>}
        {errorMessage && <div>{errorMessage}</div>}
        {albums.length > 0 && (
          albums.map((album) => (
            <ListItem key={album.id} album={album} />
          ))
        )}
      </div>
    </div>
  )
}

export default AlbumPage