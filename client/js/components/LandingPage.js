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

          <Col md={12}>

            <h2 style={{textAlign: 'center'}}>
              <img src="img/blackglassed.jpg" style={{width:40, margin:8}}/><br/>
              Francesco Sullo
            </h2>
          </Col>
        </Row>
          <Row>

            <Col md={6}>
              <h3><i className="fab fa-linkedin"></i> job</h3>
              <p>
                I quit my job as Technical Lead Manager at Tron Foundation in January to take a break from technology and do some art. More info in my <a href="https://www.linkedin.com/in/francescosullo" target="_blank">LinkedIN</a>.
              </p>
            </Col>
            <Col md={6}>
              <h3><i className="fab fa-github"></i> open source</h3>
              <p>I'm active on many projects, some related with blockchain (<a href="https://0xnil.com" target="_blank">0xNIL</a>, <a href="https://tweedentity.com" target="_blank">Tweedentity</a>, 0xAuth), some with secrets management (<a href="https://github.com/secrez/secrez" target="_blank">Secrez</a>). Take a look at my <a href="https://github.com/sullof" target="_blank">GitHub</a>.
              </p>
            </Col>
          </Row>
          <Row>

            <Col md={6}>
              <h3><i className="fab fa-amazon"></i> books</h3>
              <a>If you can read Italian, I hope you will like my short novel "Giulia, io e lo scoglio" on <a
                href="https://books.apple.com/us/book/giulia-io-e-lo-scoglio/id1441562895"
                target="_blank">Apple Books</a> for $0.99, or <a
                href="https://www.amazon.com/Giulia-io-lo-scoglio-Italian-ebook/dp/B07K7ZK5CZ"
                target="_blank">Amazon</a> for ... $1.99 (who knows why).
              </p>
            </Col>
            <Col md={6}>
              <h3><i className="fab fa-soundcloud"></i> music</h3>
              <p>I was an active musician for years. I am trying to restart. Listen my 2006 EP <a href="https://soundcloud.com/sullof/sets/cinque-canzoni" target="_blank">"Cinque canzoni"</a> on SoundCloud. More will come soon.
              </p>
            </Col>
          </Row>
          <Row>

            <Col md={6}>
              <h3><i className="fab fa-twitter"></i> news</h3>
              <p>
                I tweet passionately, mostly about cryptos, politics, and freedom. <a href="https://twitter.com/sullof" target="_blank">Follow me</a>.
              </p>
            </Col>
            <Col md={6}>
              <h3><i className="fab fa-facebook"></i> friends</h3>
              <p>Even if recently I am not very talkative, I like my friends. You can be my next one on <a href="https://fb.me/francesco.sullo" target="_blank">Facebook</a>.
              </p>
            </Col>
          </Row>
          <Row>

            <Col md={6}>
              <h3><i className="fab fa-instagram"></i> visual arts</h3>
              <p>Since the beginning of the year I am painting. I will make a website for that sooner or later, for now, you can follow me on <a href="https://instagram.com/sullof" target="_blank">Instagram</a>.
              </p>
            </Col>
            <Col md={6}>
              <h3><i className="fab fa-vimeo"></i> movies</h3>
              <p>For a while, I made a few short movies, either alone or with friends. You can watch some of them on <a href="https://vimeo.com/sullof" target="_blank">Vimeo</a>.
              </p>
            </Col>
          </Row><Row>

            <Col md={6}>
              <h3><i className="fab fa-medium"></i> blog</h3>
              <p>Recently, I wrote on Medium mostly about 0xNIL and other software projects. <a href="https://medium.com/@sullof" target="_blank">Take a look</a>.
              </p>
            </Col>
            <Col md={6}>
              <h3><i className="fa fa-envelope"></i> contact me</h3>
              <p>You can find me on Telegram, Signal, WhatsApp and many others messengers. But if you love emails, contact me <a href="mailto:francesco@sullo.co" target="_blank">the old way</a>.
              </p>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default LandingPage
