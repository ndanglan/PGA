import React from 'react'
import { IAlbum } from '../../../models/albumModel'

type Props = {
  album: IAlbum;
}

const ListItem = (props: Props) => {
  const { album } = props
  return (
    <div className="card d-flex" style={{ width: '100%' }}>
      <img src={album.thumbnailUrl} alt={album.title} />
      <div className="card-body">
        <h5 className="card-title">{album.title}</h5>
      </div>
    </div>
  )
}

export default ListItem