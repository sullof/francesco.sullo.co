import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Tile from '../components/Tile'

const UserTilesPage = () => {
  const { username } = useParams()
  const [width, setWidth] = useState(() => {
    let w = 2 * (window.innerWidth - 100) / 6
    if (window.innerWidth < 800) {
      w = window.innerWidth - 50
    }
    return w
  })

  const [user, setUser] = useState(null)
  const [allTiles, setAllTiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user info and tiles
  useEffect(() => {
    fetchUserAndTiles()
  }, [username])

  const fetchUserAndTiles = async () => {
    try {
      // Fetch user info
      const userResponse = await fetch(`/api/users/${username}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }

      // Fetch user's tiles
      const tilesResponse = await fetch(`/api/tiles/user/${username}`)
      if (tilesResponse.ok) {
        const tilesData = await tilesResponse.json()
        setAllTiles(tilesData)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

  // Utility functions from original LongLandingPage
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

  if (!user) {
    return <div>User not found</div>
  }

  // Process tiles exactly like the original LongLandingPage
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
        <div className="mypic">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={`${user.full_name || user.username || user.email}'s avatar`}/>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem',
              fontWeight: 'bold',
              borderRadius: '50%'
            }}>
              {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="name">{user.full_name || user.username || user.email}'s Hooq</div>
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

export default UserTilesPage