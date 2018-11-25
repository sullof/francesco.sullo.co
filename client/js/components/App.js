const _ = require('lodash')
import createHistory from 'history/createBrowserHistory'

const History = window.History = createHistory()
const config = require('../config')

const {Modal, Button} = ReactBootstrap

const Db = require('../utils/Db')

window.DEV = /localhost/.test(location.host)

import LandingPage from './LandingPage'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.db = new Db(data => {
      this.setState({
        data
      })
    })

    let hash0
    if (/profile/.test(location.hash)) {
      hash0 = location.hash.substring(2)
    }

    this.state = {
      connected: -1,
      connectionChecked: false,
      netId: null,
      err: null,
      loading: false,
      data: this.db.data,
      sections: {},
      config,
      ready: -1,
      hash0,
      profiles: {}
    }

    for (let m of [
      'setAppState',
      'handleClose',
      'handleShow'
    ]) {
      this[m] = this[m].bind(this)
    }

    // window.addEventListener('load', () => {
    //   let web3js
    //   if (window.ethereum) {
    //     web3js = new Web3(ethereum)
    //     return ethereum.enable()
    //       .then(() => {
    //         this.getNetwork(null, web3js)
    //       })
    //       .catch(err => {
    //         this.getNetwork('User denied account access.')
    //       })
    //   }
    //   else {
    //     // Use injected provider, start dapp
    //     web3js = new Web3(web3.currentProvider)
    //     this.getNetwork(null, web3js)
    //   }
    // })

  }

  componentDidMount() {
    History.listen(location => {
      this.setState({
        hash: location.hash
      })
    })
    document.title = '[francesco].sullo(.co)'
    this.historyPush({
      section: 'home'
    })
  }

  setAppState(states) {
    this.setState(states)
  }

  historyBack() {
    History.goBack()
  }

  historyPush(args) {
    const sections = this.state.sections
    this.setState({sections})
    History[
      args.replace ? 'replace' : 'push'
      ](`#/${args.section}`)
  }

  callMethod(method, args) {
    if ([
      'historyPush',
      'historyBack',
      'setAppState'
    ].indexOf(method) !== -1) {
      this[method](args || {})
    } else {
      console.error(`Method ${method} not allowed.`)
    }
  }

  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
  }

  render() {

    const app = {
      appState: this.state,
      callMethod: this.callMethod,
      db: this.db,
      web3js: this.web3js,
      contracts: this.contracts,
      history: History
    }

    return (
      <div>
        <LandingPage app={app}/>
        {this.state.show
          ? <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>{this.state.modalTitle}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{this.state.modalBody}</Modal.Body>

            <Modal.Footer>
              <Button onClick={() => {
                this.setState({show: false})
              }}>{this.state.modalClose || 'Close'}</Button>
              {
                this.state.secondButton
                  ? <Button onClick={() => {
                    this.state.modalAction()
                    this.setState({show: false})
                  }} bsStyle="primary">{this.state.secondButton}</Button>
                  : null
              }
            </Modal.Footer>
          </Modal.Dialog>
          : null}
      </div>
    )
  }
}

export default App
