import Basic from './Basic'

const {Grid, Row, Col, Button, Badge} = ReactBootstrap


class LandingPage extends Basic {

  // componentDidMount () {
  //   document.title = "Tweedentity - A self-claimed identity system"
  // }

  goToApp() {
    location.href = `${location.protocol}//dapp.${location.host}/#/connecting`
  }

  render() {

    return (
      <div>
      <Grid>
        <Row>
          <Col md={8}></Col>
          <Col md={4}>
            <p>
              — Francesco Sullo's Web Index —
            </p>
          </Col>
        </Row>
          <Row>
            <Col md={8}></Col>
            <Col md={2}>
              <h3><i className="fab fa-linkedin"></i> profession</h3>
              <p>
                <a href="https://www.linkedin.com/in/francescosullo" target="_blank">I am a Senior Software Engineer at Tron Foundation.
               More info in my LinkedIN.</a>
              </p>
            </Col>
            <Col md={2}>
              <h3><i className="fab fa-github"></i> open source</h3>
              <p><a href="https://github.com/sullof" target="_blank">I'm working on many projects, like 0xNIL and Tweedentity. Take a look at my GitHub.</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={8}></Col>
            <Col md={2}>
              <h3><i className="fab fa-amazon"></i> books</h3>
              <p><a
                href="https://www.amazon.com/Giulia-io-lo-scoglio-Italian-ebook/dp/B07K7ZK5CZ"
                target="_blank">Read my short novel "Giulia, io e lo scoglio" (in Italian) on Amazon.</a>
              </p>
            </Col>
            <Col md={2}>
              <h3><i className="fab fa-soundcloud"></i> music</h3>
              <p><a href="https://soundcloud.com/sullof/sets/cinque-canzoni"
                    target="_blank">Listen my 2006 EP "Cinque canzoni" on SoundCloud.</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={8}></Col>
            <Col md={2}>
              <h3><i className="fab fa-twitter"></i> news</h3>
              <p>
                <a href="https://twitter.com/sullof" target="_blank">I tweet mostly about cryptos and politics.
              Follow me.</a>
              </p>
            </Col>
            <Col md={2}>
              <h3><i className="fab fa-facebook"></i> friends</h3>
              <p><a href="https://fb.me/francesco.sullo" target="_blank">I like my friends. You can be my next one on Facebook.</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={8}></Col>
            <Col md={2}>
              <h3><i className="fab fa-instagram"></i> pictures</h3>
              <p><a href="https://instagram.com/sullof" target="_blank">While I wander I take instagrams.
                Follow me.</a>
              </p>
            </Col>
            <Col md={2}>
              <h3><i className="fab fa-vimeo"></i> movies</h3>
              <p><a href="https://vimeo.com/sullof" target="_blank">I love to make short movies, alone or with friends. Watch them on Vimeo.</a>
              </p>
            </Col>
          </Row><Row>
            <Col md={8}></Col>
            <Col md={2}>
              <h3><i className="fab fa-medium"></i> blog</h3>
              <p><a href="https://medium.com/@sullof" target="_blank">Recently, I wrote on Medium mostly about 0xNIL.</a>
              </p>
            </Col>
            <Col md={2}>
              <h3><i className="fa fa-envelope"></i> contact me</h3>
              <p><a href="mailto:francesco@sullo.co" target="_blank">The old way.</a>
              </p>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default LandingPage
