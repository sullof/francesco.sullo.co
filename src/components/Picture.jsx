import React from 'react'

const Picture = ({ data }) => {
  const link = data.link
  const img = <img
    width={data.width ? data.width : null}
    height={data.height ? data.height : null}
    src={data.src}/>

  if (data.expand) {
    // Handle expand functionality if needed
  }

  return <a href={link ? link : data.src} target={link ? '_blank' : '_picture'}>{img}</a>
}

export default Picture


