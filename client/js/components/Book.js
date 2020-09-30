class Book extends React.Component {

  render() {

    let data = this.props.data

    return (
      <div className="f84pc">
      <img
        width={data.width ? data.width : null}
        height={data.height ? data.height : null}
        src={data.src}/>
        <div className="links">
          <div className="mb4">You can buy it on</div>
        {data.amazon ? <div className="item"><a href={data.amazon} target="_blank"><i className="fab fa-amazon mr6"></i> Amazon</a></div> : null}
        {data.apple ? <div className="item"><a href={data.apple} target="_blank"><i className="fab fa-apple mr6"></i> Apple Books</a></div> : null}
        <div  className="mt4">and on the most common online book stores.</div>
        </div>
      </div>
    )

  }
}

export default Book


