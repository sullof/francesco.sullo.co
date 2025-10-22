import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Tile from '../components/Tile'

const ExplorePage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/public')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create user tiles for the explore page
  const createUserTile = (userData) => {
    return {
      type: 'user',
      title: userData.full_name || userData.username || userData.email,
      subtitle: userData.username ? `@${userData.username}` : userData.email,
      year: new Date(userData.created_at).getFullYear().toString(),
      link: `/tiles/${userData.username}`,
      tile_count: userData.tile_count,
      user_id: userData.user_id,
      avatar_url: userData.avatar_url
    }
  }

  if (loading) {
    return <div>Loading collections...</div>
  }

  // Convert users to tiles and organize them in columns like the original
  const userTiles = users.map(createUserTile)
  
  // Organize tiles into columns (similar to LongLandingPage)
  const li = [[], [], [], []]
  
  // Distribute user tiles across columns
  userTiles.forEach((tile, index) => {
    const columnIndex = index % 4
    li[columnIndex].push(
      <Tile
        data={tile}
        key={`user-${tile.user_id}`}
      />
    )
  })

  return (
    <div>
      <div className="header">
        <div className="name">Explore Collections</div>
        <div className="spec">Discover the creative spaces of our community members</div>
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

export default ExplorePage
