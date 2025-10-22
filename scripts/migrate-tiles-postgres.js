const { Pool } = require('pg')
const path = require('path')
const fs = require('fs')

// Database configuration
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

// Read tiles.json
const tilesJsonPath = path.resolve(__dirname, '../client/js/components/tiles.json')
const tilesData = JSON.parse(fs.readFileSync(tilesJsonPath, 'utf8'))

// Function to insert a tile
const insertTile = async (tile, columnIndex) => {
  const sql = `
    INSERT INTO tiles (
      column_index, type, title, subtitle, year, what, tracks, playlists,
      src, link, width, height, expand, pin, extra, body, style, track
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `
  
  const values = [
    columnIndex,
    tile.type,
    tile.title || null,
    tile.subtitle || null,
    tile.year || null,
    tile.what || null,
    tile.tracks || null,
    tile.playlists || null,
    tile.src || null,
    tile.link || null,
    tile.width || null,
    tile.height || null,
    tile.expand || false,
    tile.pin || false,
    tile.extra || null,
    tile.body ? JSON.stringify(tile.body) : null,
    tile.style ? JSON.stringify(tile.style) : null,
    tile.track || null
  ]

  const result = await pool.query(sql, values)
  return result.rows[0]
}

// Clear existing data and insert new data
const migrateTiles = async () => {
  try {
    console.log('Connecting to PostgreSQL database...')
    const client = await pool.connect()
    console.log('Connected successfully')

    console.log('Clearing existing tiles...')
    await client.query('DELETE FROM tiles')
    console.log('Existing tiles cleared')

    console.log('Inserting tiles from JSON...')
    let totalInserted = 0

    for (const [columnIndex, tiles] of Object.entries(tilesData)) {
      console.log(`Processing column ${columnIndex} with ${tiles.length} tiles...`)
      
      for (const tile of tiles) {
        try {
          await insertTile(tile, parseInt(columnIndex))
          totalInserted++
        } catch (err) {
          console.error(`Error inserting tile:`, err.message)
          console.error('Tile data:', tile)
        }
      }
    }

    console.log(`Migration complete! Inserted ${totalInserted} tiles.`)
    
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run migration
migrateTiles()

