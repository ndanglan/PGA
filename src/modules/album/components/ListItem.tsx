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
          value={title}
          style={{
            backgroundColor: id % 2 === 0 ? 'grey' : 'white',
          }}
          onChange={(e) => {
            dispatch(setTitleValue(e.target.value, id))
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