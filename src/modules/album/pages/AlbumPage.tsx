import { push } from 'connected-react-router'
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

      // check nếu state hiện tại chưa có albums thì lưu data mới 
      if (json.resData?.length > 0 && json.albums.length === 0) {
        // lưu data trả về vào store theo 1 format mới có title và prevTitle
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
      // nếu đã có album thì nối thêm mảng mới load vào mảng trong store
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
    // mỗi thi value của 1 input thay đổi sẽ set lại state albums 
    setAlbums((prev: IAlbum[]) => {
      let check = false;
      //  tạo 1 mảng mới là mảng có obj có title đã thay đổi 
      const newArr = prev.map(album => {
        if (album.id === id) {
          if (album.title !== title) {
            album.title = title;
          }
        }
        // sau khi lưu được title mới thì check title với prevTitle( không bị lưu bằng title truyền vào) nếu có 1 cái khác nhau thì enable button còn tất cả giống nhau thì disable button confirm (state check để xác định trạng thái của button)
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
    // khi confirm truyền vào state albums hiện tại rồi chuyển hết prevTitle trong mỗi obj trong mảng thành title mới (nếu có)
    const newList = list.map(album => {
      if (album.prevTitle !== album.title) {
        album.prevTitle = album.title;
      }
      return album
    })

    dispatch(setAlbum(newList))
    // sau khi confirm thì button disable
    setChanged(false);
  }

  const onReset = (list: IAlbum[]) => {
    // khi ấn reset chuyển hết title về prevTitle trước đó nếu title thay đổi 
    const newList = list.map(album => {
      if (album.prevTitle !== album.title && !!(album.prevTitle)) {
        album.title = album.prevTitle;
      }
      return album
    })

    dispatch(setAlbum(newList))
    // sau khi reset thì button disable
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
        // khi xác định được trạng thái ở bottom thì load thêm
        setAmount(prev => prev + 1)
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      // sau khi useEffect gọi DomEvent thì clean
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

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