const _ = require('lodash')
import createHistory from 'history/createBrowserHistory'

const History = window.History = createHistory()

window.DEV = /localhost/.test(location.host)

import LongLandingPage from './LongLandingPage'

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
      profiles: {}
    }

    for (let m of [
      'setAppState',
      'handleClose',
      'handleShow'
    ]) {
      this[m] = this[m].bind(this)
    }

  }

  componentDidMount() {
    History.listen(location => {
      this.setState({
        hash: location.hash
      })
    })
    document.title = '[francesco.]sullo(.co)'
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
      history: History
    }

    return (
      <div>
        <LongLandingPage app={app}/>
      </div>
    )
  }
}

export default App
