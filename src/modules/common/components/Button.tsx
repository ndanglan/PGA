import React from 'react'

type Props = {
  styles: React.CSSProperties,
  content?: string,
  class?: string,
  handleClick?: () => void
}

const Button = (props: Props) => {
  const { styles, content, ...other } = props
  return (
    <button type="button" className={`btn ${props.class}`} style={styles} {...other} onClick={other.handleClick}>
      {content}
    </button>
  )
}

export default Button