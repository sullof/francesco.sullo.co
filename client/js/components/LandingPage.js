import Basic from './Basic'
import data from './data.json'

const {Grid, Row, Col} = ReactBootstrap

class LandingPage extends Basic {

  render() {

    let total = 12
    let c = 4
    let md = 3

    let rows = [
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
        rows[Math.floor(i / c) + 1] = <Row>{cols}</Row>
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


