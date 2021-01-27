class Picture extends React.Component {

  render() {

    let data = this.props.data
    let link = data.link
    let img = <img
      width={data.width ? data.width : null}
      height={data.height ? data.height : null}
      src={data.src}/>

    return <a href={link ? link : data.src} target={link ? '_blank' : '_picture'}>{img}</a>

  }
}

export default Picture


