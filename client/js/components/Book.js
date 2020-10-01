class Book extends React.Component {

  render() {

    let data = this.props.data

    return (
      <div className="f84pc">
      <img
        width={data.width ? data.width : null}
        height={data.height ? data.height : null}
        src={data.src}/>
        </div>
    )

  }
}

export default Book


