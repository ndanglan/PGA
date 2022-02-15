import React, { useEffect, useState, memo } from 'react'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { IAlbum } from '../../../models/albumModel'
import { AppState } from '../../../redux/reducer'
import { setTitleValue } from '../redux/albumReducer'
import "../styles/ListItem.css"

interface Props {
  id: number,
  title: string,
  prevTitle: string,
  thumbnailUrl: string,
  changed: boolean
}

const ListItem = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { id, title, prevTitle, thumbnailUrl } = props;

  const [valueTitle, setValueTitle] = useState(() => {
    if (prevTitle === title) {
      return title
    } else {
      return prevTitle
    }
  });

  // set dữ liệu vào title ( là title đang được thay đổi)
  useEffect(() => {
    console.log('title', title);

    dispatch(setTitleValue(valueTitle, id))
  }, [valueTitle])

  // set lại title hiện ra ở màn hình sau khi confirm hoặc reset 
  useEffect(() => {
    setValueTitle(title)
  }, [title])
  return (
    <div className="card d-flex p-3 flex-row"
      style={{
        width: '100%',
        backgroundColor: id % 2 === 0 ? 'grey' : 'white'
      }}
    >
      <img src={thumbnailUrl} alt={title} style={{ width: "100px" }} />
      <div className="card-body">
        <input
          type="text"
          className="w-100 p-0 input-item"
          value={valueTitle}
          style={{
            backgroundColor: id % 2 === 0 ? 'grey' : 'white',
          }}
          onChange={(e) => {
            setValueTitle(e.target.value)
          }}
        />
        <div>
          {Date.now()}
        </div>
      </div>
    </div>
  )
}

export default memo(ListItem)