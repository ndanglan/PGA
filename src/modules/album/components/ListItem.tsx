import React, { useState, memo, useEffect } from 'react'
import "../styles/ListItem.css"

interface Props {
  id: number,
  title: string,
  thumbnailUrl: string,
  prevTitle?: string,
  changed: boolean,
  onChange(values: string, id: number): void
}

const ListItem = (props: Props) => {
  const { id, title, thumbnailUrl, prevTitle } = props;
  const [titleState, setTitleState] = useState(title)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleState(e.target.value);
    const timout = setTimeout(() => {
      props.onChange(e.target.value, id)
    }, 500);

    return () => {
      clearTimeout(timout)
    }
  }

  useEffect(() => {
    setTitleState(title)
  }, [title, prevTitle])

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
          value={titleState}
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