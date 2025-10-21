const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Database path
const dbPath = path.resolve(__dirname, '../db/tiles.sqlite3')
const db = new sqlite3.Database(dbPath)

// Read tiles.json
const tilesJsonPath = path.resolve(__dirname, '../client/js/components/tiles.json')
const tilesData = JSON.parse(fs.readFileSync(tilesJsonPath, 'utf8'))

// Function to insert a tile
const insertTile = (tile, columnIndex) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO tiles (
        column_index, type, title, subtitle, year, what, tracks, playlists,
        src, link, width, height, expand, pin, extra, body, style, track
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    db.run(sql, values, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve(this.lastID)
      }
    })
  })
}

// Clear existing data and insert new data
const migrateTiles = async () => {
  try {
    console.log('Clearing existing tiles...')
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM tiles', (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

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
  } finally {
    db.close()
  }
}

// Run migration
migrateTiles()
