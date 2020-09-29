

class Basic extends React.Component {
  constructor(props) {
    super(props)

    this.bindAll = this.bindAll.bind(this)
    this.bindAll([
      'setGlobalState',
      'getGlobalState',
      'historyPush',
      'appState'
    ])
  }

  bindAll(methods) {
    for (let m of methods) {
      this[m] = this[m].bind(this)
    }
  }

  capitalize(x) {
    return x.substring(0,1).toUpperCase() + x.substring(1)
  }

  appState() {
    return this.props.app.appState
  }

  getGlobalState(prop) {
    const as = this.appState()
  }

  setGlobalState(pars, states = {}) {
    this.props.app.callMethod('setAppState', states)
  }

  historyPush(section) {
    this.props.app.callMethod('historyPush', {section})
  }

  render() {
    return <div/>
  }
}

export default Basic
