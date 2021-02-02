import Basic from './Basic'
import allTiles from './tiles.json'
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

    function sortTiles (a,b) {
      let A = a.year
      let B = b.year
      let C = a.pin
      let D = b.pin
      return C || A > B ? -1 : D || A < B ? 1 : 0
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex
      while (0 !== currentIndex) {
       randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }
      return array;
    }

    for (let k=0; k<4; k++) {

      let tiles = shuffle(allTiles[''+k]).sort(sortTiles)
      for (let i = 0; i < tiles.length; i++) {
        if (k % 4 === 1 || k % 4 === 2) {
          tiles[i].width = this.state.width
        }
        li[k].push(
          <Tile
            data={tiles[i]}
            key={`key${i}`}
          />
        )
      }
    }

    return (
      <div>
        <div className="header">
          <div className="mypic"><img src="img/blackglassed.jpg"/></div>
          <div className="name">Francesco Sullo's Hooq</div>
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
