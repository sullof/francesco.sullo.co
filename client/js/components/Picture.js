class Picture extends React.Component {

  render() {

    let data = this.props.data
    let link = data.link
    let img = <img
      width={data.width ? data.width : null}
      height={data.height ? data.height : null}
      src={data.src}/>

    if (link) {
      return <a href={link} target="_blank">{img}</a>
    } else {
      return img
    }

  }
}

export default Picture


