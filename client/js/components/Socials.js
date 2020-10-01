class Socials extends React.Component {

  render() {

    let data = this.props.data

    function getI(link, icon) {
      return <a className="black" href={link} target="_blank"><i className={`fab fa-${icon} f200pc`}/></a>
    }


    return (
      <div>
        <div className="socials">
          {getI('https://twitter.com/sullof', 'twitter')}
          {getI('https://facebook.com/francescosullo', 'facebook')}
          {getI('https://instagram.com/sullof', 'instagram')}
          {getI('https://github.com/sullof', 'github')}
          {getI('https://www.linkedin.com/in/francescosullo/', 'linkedin')}
          <br/>
          {getI('https://pinterest.com/sullof', 'pinterest')}
          {getI('https://www.goodreads.com/author/show/20436449.Francesco_Sullo', 'goodreads')}
          {getI('https://vimeo.com/francescosullo', 'vimeo')}
          {getI('https://medium.com/@sullof', 'medium')}
          {getI('https://www.youtube.com/channel/UCe7mSAskM-qw-xRpVxqc9NQ', 'youtube-square')}
          <br/>

          <div className="linkEmail">
          <a href="mailto:francesco@sullo.co">francesco@sullo.co</a></div>
        </div>
      </div>
    )

  }
}

export default Socials


