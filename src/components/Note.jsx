import React from 'react'
import Extra from './Extra.jsx'

const Note = ({ data }) => {
  let i = 0
  const paragraphs = data.body.map(p => <p key={'p_key_' + i++} dangerouslySetInnerHTML={{__html: p}}/>)

  return <div className={'noteBody'} style={data.style || {}}>{paragraphs}</div>
}

export default Note


