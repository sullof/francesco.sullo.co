class Spotify extends React.Component {

  render() {

    let data = this.props.data

    let img = null

    if (data.src) {
      img = <img
        className="soundCover"
        width={data.width ? data.width : null}
        height={data.height ? data.height : null}
        src={data.src}/>
    }

    let iframe = <iframe
          style={{borderRadius: '12px'}}
          width={data.width ? data.width : '100%'}
          height={data.height ? data.height : 166}
          scrolling="no"
          allowFullScreen=""
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          src={`https://open.spotify.com/embed/playlist/${data.playlists}?utm_source=generator&theme=0`}/>

    return (
      <div>
        {img}
        {iframe}
      </div>
    )
  }
}

export default Spotify
