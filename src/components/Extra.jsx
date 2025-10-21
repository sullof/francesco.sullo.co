import React from 'react'

const Extra = ({ data }) => {
  return (
    <div className="extra" dangerouslySetInnerHTML={{__html: data.extra}} />
  )
}

export default Extra


