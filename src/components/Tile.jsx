import React from 'react'
import Soundcloud from './Soundcloud.jsx'
import Vimeo from './Vimeo.jsx'
import Picture from './Picture.jsx'
import Socials from './Socials.jsx'
import Book from './Book.jsx'
import Extra from './Extra.jsx'
import Note from './Note.jsx'
import Spotify from './Spotify.jsx'

const Tile = ({ data, app }) => {
  // Add app to data for child components
  const dataWithApp = { ...data, app }

  let content = <div/>
  let extra = null

  if (data.extra) {
    extra = <Extra data={dataWithApp} />
  }

  if (data.type === 'soundcloud') {
    content = <Soundcloud data={dataWithApp} />
  } else if (data.type === 'spotify') {
    content = <Spotify data={dataWithApp} />
  } else if (data.type === 'vimeo') {
    content = <Vimeo data={dataWithApp} />
  } else if (data.type === 'picture') {
    content = <Picture data={dataWithApp} />
  } else if (data.type === 'socials') {
    content = <Socials data={dataWithApp} />
  } else if (data.type === 'note') {
    content = <Note data={dataWithApp} />
  } else if (data.type === 'book') {
    content = <Book data={dataWithApp} />
  }

  return (
    <li>
      {data.what || data.year ?
        <div className="lihead">
          <div className="what">{data.what}</div>
          <div className="year">{data.year}</div>
          <br style={{clearAfter: 'both'}}/>
        </div>
        : null
      }
      {content}
      {
        data.title || data.subtitle ? <div className="lititle">{data.title}
          {data.subtitle ? <div className="liinfo">{data.subtitle}</div> : null}</div> : null
      }
      {extra}
    </li>
  )
}

export default Tile


