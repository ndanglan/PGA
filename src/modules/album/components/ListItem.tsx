import React, { useEffect, useState, memo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { AppState } from '../../../redux/reducer';
import { activeChange } from '../redux/albumReducer';
import "../styles/ListItem.css"

interface Props {
  id: number,
  title: string,
  thumbnailUrl: string,
  changed: boolean,
  onChange(values: string, id: number): void
}

const ListItem = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { id, title, thumbnailUrl } = props;
  const [titleState, setTitleState] = useState(title)
  const albumObj = useSelector((state: AppState) => state.album);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!albumObj.changed) {
      dispatch(activeChange())
    }
    setTitleState(e.target.value);
    const confirm = setTimeout(() => {
      props.onChange(e.target.value, id)
    }, 500);
    return () => {
      clearTimeout(confirm);
    }
  }

  useEffect(() => {
    console.log(`curTitle:${id}`, titleState);

  }, [titleState])


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
          value={albumObj.changed ? titleState : title}
          style={{
            backgroundColor: id % 2 === 0 ? 'grey' : 'white',
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleTitleChange(e)
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