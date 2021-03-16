const _ = require('lodash')

window.DEV = /localhost/.test(location.host)

import LongLandingPage from './LongLandingPage'
import Extra from './Extra'
import Modal from 'react-modal'

class App extends React.Component {

  constructor(props) {
    super(props)

    let hash0
    if (/profile/.test(location.hash)) {
      hash0 = location.hash.substring(2)
    }

    this.state = {
      err: null,
      loading: false,
      sections: {},
      profiles: {},
      // show: {
      //   'type': 'picture',
      //   'expand': true,
      //   'title': 'Studio #7 - Untitled',
      //   'subtitle': 'Oil on Cotton Paper, 12 x 16 inch',
      //   'year': '2020',
      //   'what': 'Art',
      //   'src': 'https://francesco-sullo-co.s3.amazonaws.com/StudioN7Untitled.jpg'
      // }
    }

    for (let m of [
      'setAppState',
      'handleClose',
      'handleShow'
    ]) {
      this[m] = this[m].bind(this)
    }

    Modal.setAppElement('#app')

  }

  componentDidMount() {
  }

  setAppState(states) {
    this.setState(states)
  }

  callMethod(method, args) {
    // if ([
    //   'historyPush',
    //   'historyBack',
    //   'setAppState'
    // ].indexOf(method) !== -1) {
    //   this[method](args || {})
    // } else {
    //   console.error(`Method ${method} not allowed.`)
    // }
  }

  handleClose() {
    this.setState({show: false})
  }

  handleShow(show) {
    this.setState({show})
  }

  getWidth() {
    let width = 2 * (window.innerWidth - 100) / 6
    if (window.innerWidth < 800) {
      width = window.innerWidth - 50
    }
    return width
  }

  render() {

    const app = {
      appState: this.state,
      callMethod: this.callMethod,
      // history: History
    }

    // const customStyles = {
    //   content: {
    //     top: '50%',
    //     left: '50%',
    //     right: 'auto',
    //     bottom: 'auto',
    //     marginRight: '-50%',
    //     transform: 'translate(-50%, -50%)'
    //   }
    // }

    const {
      src,
      title,
      subtitle,
      when,
      extra,
      what
    } = this.state.show ? this.state.show : {}


    return (
      <div>
        <LongLandingPage app={app}/>
        <Modal
          isOpen={!!this.state.show}
          onRequestClose={this.handleClose}
          // style={customStyles}
          contentLabel="Example Modal"
        >

          <h2>Hello</h2>
          <button onClick={this.handleClose}>close</button>
          <div>I am a modal</div>
          <div><img src={src}/></div>
        </Modal>
      </div>
    )
  }
}

export default App
