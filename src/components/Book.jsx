import React from 'react'

const Book = ({ data }) => {
  return (
    <div className="f84pc">
    <img
      width={data.width ? data.width : null}
      height={data.height ? data.height : null}
      src={data.src}/>
      </div>
  )
}

export default Book


