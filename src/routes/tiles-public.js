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

// Get tiles by username
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params

    const client = await pool.connect()
    try {
      // First get the user_id from username
      const userResult = await client.query(
        'SELECT user_id FROM users WHERE username = $1',
        [username]
      )

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      const userId = userResult.rows[0].user_id

      // Get tiles for this user
      const tilesResult = await client.query(
        `SELECT 
          column_index,
          type, title, subtitle, year, what, tracks, playlists,
          src, link, width, height, expand, pin, extra, body, style, track
        FROM tiles 
        WHERE user_id = $1
        ORDER BY column_index, pin DESC, year DESC, id ASC`,
        [userId]
      )

      const rows = tilesResult.rows

      // Group tiles by column_index
      const tilesByColumn = {}
      rows.forEach(row => {
        const columnIndex = row.column_index.toString()
        if (!tilesByColumn[columnIndex]) {
          tilesByColumn[columnIndex] = []
        }

        // Parse JSON fields
        const tile = {
          type: row.type,
          title: row.title,
          subtitle: row.subtitle,
          year: row.year,
          what: row.what,
          tracks: row.tracks,
          playlists: row.playlists,
          src: row.src,
          link: row.link,
          width: row.width,
          height: row.height,
          expand: Boolean(row.expand),
          pin: Boolean(row.pin),
          extra: row.extra,
          body: row.body,
          style: row.style,
          track: row.track
        }

        // Remove undefined values
        Object.keys(tile).forEach(key => {
          if (tile[key] === undefined) {
            delete tile[key]
          }
        })

        tilesByColumn[columnIndex].push(tile)
      })

      res.json(tilesByColumn)
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Get user tiles error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
