import React, { useState, useEffect, useCallback } from 'react'
import Tile from './Tile.jsx'

const LongLandingPage = ({ app }) => {
  const [width, setWidth] = useState(() => {
    let w = 2 * (window.innerWidth - 100) / 6
    if (window.innerWidth < 800) {
      w = window.innerWidth - 50
    }
    return w
  })

  const [allTiles, setAllTiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch tiles from API
  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const response = await fetch('/api/tiles')
        if (!response.ok) {
          throw new Error('Failed to fetch tiles')
        }
        const data = await response.json()
        setAllTiles(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching tiles:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchTiles()
  }, [])

  const getWidth = useCallback(() => {
    let w = 2 * (window.innerWidth - 100) / 6
    if (window.innerWidth < 800) {
      w = window.innerWidth - 50
    }
    return w
  }, [])

  const updateDimensions = useCallback(() => {
    setWidth(getWidth())
  }, [getWidth])

  useEffect(() => {
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    
    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [updateDimensions])

  // Utility functions from Basic component
  const capitalize = useCallback((x) => {
    return x.substring(0,1).toUpperCase() + x.substring(1)
  }, [])

  const appState = useCallback(() => {
    return app.appState
  }, [app])

  const getGlobalState = useCallback((prop) => {
    const as = appState()
  }, [appState])

  const setGlobalState = useCallback((pars, states = {}) => {
    app.callMethod('setAppState', states)
  }, [app])

  const historyPush = useCallback((section) => {
    app.callMethod('historyPush', {section})
  }, [app])

  // Tile processing functions
  const sortTiles = useCallback((a, b) => {
    let A = a.year
    let B = b.year
    let C = a.pin
    let D = b.pin
    return C || A > B ? -1 : D || A < B ? 1 : 0
  }, [])

  const shuffle = useCallback((array) => {
    var currentIndex = array.length, temporaryValue, randomIndex
    while (0 !== currentIndex) {
     randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }, [])

  if (loading) {
    return <div>Loading tiles...</div>
  }

  if (error) {
    return <div>Error loading tiles: {error}</div>
  }

  // Process tiles
  const li = [[], [], [], []]

  for (let k = 0; k < 4; k++) {
    const columnTiles = allTiles[k.toString()] || []
    let tiles = shuffle([...columnTiles]).sort(sortTiles)
    for (let i = 0; i < tiles.length; i++) {
      if (k % 4 === 1 || k % 4 === 2) {
        tiles[i].width = width
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

export default LongLandingPage