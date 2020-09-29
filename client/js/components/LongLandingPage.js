import Basic from './Basic'
import tiles from './tiles.json'
import Tile from './Tile'

class LongLandingPage extends Basic {

  constructor(props) {
    super(props)
    this.state = {
      width: this.getWidth()
    }
  }

  getWidth() {
    let width = 2 * (window.innerWidth - 100) / 6
    if (window.innerWidth < 800) {
      width = window.innerWidth - 50
    }
    return width
  }

  updateDimensions() {
    this.setState({ width: this.getWidth() })
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {

    let li = [[], [], [], []]

    for (let i = 0; i < tiles.length; i++) {
      let j = tiles[i].index
      if (j % 4 === 1 || j % 4 === 2) {
        tiles[i].width = this.state.width
      }
      li[j].push(
        <Tile
          data={tiles[i]}
          key={`key${i}`}
        />
      )
    }

    return (
      <div>
        <div className="header">
          <div className="mypic"><img src="img/blackglassed.jpg"/></div>
          <div className="name">Francesco Sullo's Essential Web Index</div>
          {/*<div className="spec"></div>*/}
        </div>
        <div className="boardz centered-block">
          <ul>{li[0]}</ul>
          <ul>{li[1]}</ul>
          <ul>{li[2]}</ul>
          <ul>{li[3]}</ul>
        </div>
      </div>
    )
  }
}

export default LongLandingPage
