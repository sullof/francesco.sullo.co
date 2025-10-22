require('dotenv').config()
const express = require('express')
const router = express.Router()
const { Pool } = require('pg')

// Database configuration
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

// Get public user list (for explore page)
router.get('/public', async (req, res) => {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT u.user_id, u.email, u.username, u.full_name, u.created_at, u.avatar_url,
                COUNT(t.id) as tile_count
         FROM users u
         LEFT JOIN tiles t ON u.user_id = t.user_id
         WHERE u.is_admin = FALSE
         GROUP BY u.user_id, u.email, u.username, u.full_name, u.created_at, u.avatar_url
         ORDER BY u.created_at DESC`
      )

      const users = result.rows.map(row => ({
        user_id: row.user_id,
        email: row.email,
        username: row.username,
        full_name: row.full_name,
        created_at: row.created_at,
        avatar_url: row.avatar_url,
        tile_count: parseInt(row.tile_count)
      }))

      res.json({ users })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Get public users error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params

    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT user_id, email, username, full_name, created_at, avatar_url FROM users WHERE username = $1',
        [username]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ user: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Get user error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
