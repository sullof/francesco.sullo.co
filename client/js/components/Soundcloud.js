class Soundcloud extends React.Component {

  render() {

    let data = this.props.data

    if (data.tracks) {

      return (
        <iframe
          width={data.width ? data.width : '100%'}
          height={data.height ? data.height : 166}
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${data.tracks}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true`}/>
      )
    } else {

      return (
        <iframe
          width={data.width ? data.width : '100%'}
          height={data.height ? data.height : 450}
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/${data.playlists}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}/>
      )

    }
  }
}

export default Soundcloud


