import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import LongLandingPage from './LongLandingPage.jsx'
import Extra from './Extra.jsx'
// import Modal from 'react-modal'

window.DEV = /localhost/.test(location.host)

const App = () => {
  // Initialize state with useState
  const [state, setState] = useState({
    err: null,
    loading: false,
    sections: {},
    profiles: {},
    show: null
    // show: {
    //   'type': 'picture',
    //   'expand': true,
    //   'title': 'Studio #7 - Untitled',
    //   'subtitle': 'Oil on Cotton Paper, 12 x 16 inch',
    //   'year': '2020',
    //   'what': 'Art',
    //   'src': 'https://francesco-sullo-co.s3.amazonaws.com/StudioN7Untitled.jpg'
    // }
  })

  // Convert methods to functions using useCallback for optimization
  const setAppState = useCallback((states) => {
    setState(prevState => ({ ...prevState, ...states }))
  }, [])

  const callMethod = useCallback((method, args) => {
    // if ([
    //   'historyPush',
    //   'historyBack',
    //   'setAppState'
    // ].indexOf(method) !== -1) {
    //   this[method](args || {})
    // } else {
    //   console.error(`Method ${method} not allowed.`)
    // }
  }, [])

  const handleClose = useCallback(() => {
    setState(prevState => ({ ...prevState, show: false }))
  }, [])

  const handleShow = useCallback((show) => {
    setState(prevState => ({ ...prevState, show }))
  }, [])

  const getWidth = useCallback(() => {
    let width = 2 * (window.innerWidth - 100) / 6
    if (window.innerWidth < 800) {
      width = window.innerWidth - 50
    }
    return width
  }, [])

  // Create app object to pass to child components
  const app = {
    appState: state,
    callMethod: callMethod,
    // history: History
  }

  // Destructure show data for modal (currently commented out)
  const {
    src,
    title,
    subtitle,
    when,
    extra,
    what
  } = state.show ? state.show : {}

  return (
    <div>
      <LongLandingPage app={app}/>
      {/*<Modal*/}
      {/*  isOpen={!!state.show}*/}
      {/*  onRequestClose={handleClose}*/}
      {/*  // style={customStyles}*/}
      {/*  contentLabel="Example Modal"*/}
      {/*>*/}

      {/*  <h2>Hello</h2>*/}
      {/*  <button onClick={handleClose}>close</button>*/}
      {/*  <div>I am a modal</div>*/}
      {/*  <div><img src={src}/></div>*/}
      {/*</Modal>*/}
    </div>
  )
}

export default App
