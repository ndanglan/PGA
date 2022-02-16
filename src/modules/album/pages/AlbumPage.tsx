import { push } from 'connected-react-router'
import { isBuffer } from 'lodash'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { API_PATHS } from '../../../config/api'
import { ROUTES } from '../../../config/routes'
import { IAlbum } from '../../../models/albumModel'
import { AppState } from '../../../redux/reducer'
import ListItem from '../components/ListItem'
import { setAlbum, updateAlbum } from '../redux/albumReducer'

const AlbumPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const albumObj = useSelector((state: AppState) => state.album);
  const [albums, setAlbums] = useState<IAlbum[]>(albumObj.albums);
  const [changed, setChanged] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(10);

  const fetchAlbum = useCallback(
    async (amount: number) => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(async (dispatch, getState) => {
        const { album } = getState();

        const res = await fetch(`${API_PATHS.album}?_start=${amount - 10 === 0 ? amount - 10 : amount - 1}&_end=${amount}`);

        const resData = await res.json();

        return { resData, albums: album.albums }
      });

      setLoading(false);

      if (json.resData?.length > 0 && json.albums.length === 0) {
        const newJson = json.resData.map((item: IAlbum) => {
          return {
            ...item,
            prevTitle: item.title
          }
        })
        dispatch(setAlbum(newJson))
        setAlbums(newJson)
        return;
      }
      else if (json.albums.length !== 0) {
        const newJson = json.resData.map((item: IAlbum) => {
          return {
            ...item,
            prevTitle: item.title
          }
        })
        dispatch(updateAlbum(newJson));
        setAlbums((prev) => ([
          ...prev,
          ...newJson
        ]))
      }
    }
    , [dispatch]);

  const onChange = useCallback((title: string, id: number) => {
    setAlbums((prev: IAlbum[]) => {
      let check = false;
      const newArr = prev.map(album => {
        if (album.id === id) {
          if (album.title !== title) {
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

  const isBottom = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) {
      return false
    }
    return ref.current.getBoundingClientRect().bottom <= window.innerHeight;
  }
  useEffect(() => {
    fetchAlbum(amount);
  }, [amount])

  useEffect(() => {

    const onScroll = () => {
      if (isBottom(contentRef)) {
        setAmount(prev => prev + 1)
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  useEffect(() => {
    console.log(albums);

  }, [albums])

  return (
    <div ref={contentRef} className="container mx-auto mt-5 d-flex flex-column" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-end mb-3" style={{ columnGap: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={() => fetchAlbum(20)}>Refresh</button>
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