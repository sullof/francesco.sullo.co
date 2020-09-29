class Picture extends React.Component {

  render() {

    let data = this.props.data

    return (
      <img
        width={data.width ? data.width : null}
        height={data.height ? data.height : null}
        src={`img/pic/${data.src}`}/>
    )

  }
}

export default Picture


