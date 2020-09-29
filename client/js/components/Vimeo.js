class Vimeo extends React.Component {

  render() {

    let data = this.props.data

    if (data.width) {
      data.height = Math.round(data.width * 360 / 640)
    }

    return (
      <iframe
        src={`https://player.vimeo.com/video/${data.track}`}
        width={data.width ? data.width : 640}
        height={data.height ? data.height : 380}
        frameBorder="0"
        allow="autoplay; fullscreen" allowFullScreen/>
    )

  }
}

export default Vimeo


