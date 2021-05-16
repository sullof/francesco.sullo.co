import Basic from './Basic'
import data from './data.json'

const {Grid, Row, Col} = ReactBootstrap

class LandingPage extends Basic {

  constructor(props) {
    super(props)
    this.setState({
      modalData: {}
    })

    this.bindAll([
      'handleClose',
      'handleOpen'
    ])
  }

  shuffle(a) {
    var j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }
    return a
  }

  handleClose() {
    this.setState({modalData: {}})
  }

  handleOpen(data) {
    this.setState({modalData: data})
  }

  render() {

    let total = 12
    let c = 4
    let md = 3

    let hashtags = this.shuffle([
      'BlackLivesMatter',
      'DefundThePolice',
      'FreeJulianAssange',
      'Whistleblowermovement'
    ])

    let rows = [
      <Row className="blacker">
        {hashtags.map(h =>
          <Col md="3">
          <div className="black">
            <h2>
              <a href={'https://twitter.com/search?q=%23' + h}>#{h}</a>
            </h2>
          </div>
        </Col>
        )}
      </Row>,
      <Row>
        <Col md={total}>
          <h2 style={{textAlign: 'center'}}>
            <img src="img/blackglassed.jpg" style={{width: 40, margin: 8, borderRadius: 20}}/><br/>
            Francesco<br/>
            Sullo
          </h2>
        </Col>
      </Row>
    ]
    let cols = []

    for (let i = 0; i < data.length; i++) {

      let content = []
      for (let c of data[i].content) {
        if (!c) {
          content.push(<br/>)
        } else if (Array.isArray(c)) {
          content.push(<a href={c[0]} target="_blank">{c[1]}</a>)
        } else {
          content.push(c)
        }
      }

      cols[i % c] = <Col md={md}>
        <h3>{data[i].title}</h3>
        <p>{content}</p>
      </Col>

      if (i % c === c - 1 || i === data.length - 1) {
        rows[Math.floor(i / c) + 2] = <Row>{cols}</Row>
        cols = []
      }

    }

    return (
      <div>
        <Grid>
          {rows}
        </Grid>
      </div>
    )
  }
}

export default LandingPage


