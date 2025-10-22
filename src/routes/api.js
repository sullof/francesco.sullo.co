const express = require('express')
const router = express.Router()
const jsonParser = require('body-parser').json()
const { Pool } = require('pg')

console.log('API routes loaded')

// Database configuration
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

// Get all tiles grouped by column
router.get('/tiles', async (req, res) => {
  console.log('GET /api/tiles called')
  try {
    const sql = `
      SELECT 
        column_index,
        type, title, subtitle, year, what, tracks, playlists,
        src, link, width, height, expand, pin, extra, body, style, track
      FROM tiles 
      ORDER BY column_index, pin DESC, year DESC, id ASC
    `

    const result = await pool.query(sql)
    const rows = result.rows

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
  } catch (err) {
    console.error('Error fetching tiles:', err.message)
    res.status(500).json({ error: 'Failed to fetch tiles' })
  }
})

// Get tiles by column
router.get('/tiles/:column', async (req, res) => {
  console.log('GET /api/tiles/:column called with:', req.params.column)
  const columnIndex = parseInt(req.params.column)
  
  if (isNaN(columnIndex) || columnIndex < 0 || columnIndex > 3) {
    return res.status(400).json({ error: 'Invalid column index. Must be 0-3.' })
  }

  try {
    const sql = `
      SELECT 
        type, title, subtitle, year, what, tracks, playlists,
        src, link, width, height, expand, pin, extra, body, style, track
      FROM tiles 
      WHERE column_index = $1
      ORDER BY pin DESC, year DESC, id ASC
    `

    const result = await pool.query(sql, [columnIndex])
    const rows = result.rows

    const tiles = rows.map(row => {
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

      return tile
    })

    res.json(tiles)
  } catch (err) {
    console.error('Error fetching tiles for column:', err.message)
    res.status(500).json({ error: 'Failed to fetch tiles' })
  }
})

module.exports = router