const Database = require('better-sqlite3')
const path = require('path')

// Create database connection
const dbPath = path.resolve(__dirname, '../db/tiles.sqlite3')
const db = new Database(dbPath)

// Create tiles table
const createTilesTable = `
CREATE TABLE IF NOT EXISTS tiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  column_index INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  year TEXT,
  what TEXT,
  tracks TEXT,
  playlists TEXT,
  src TEXT,
  link TEXT,
  width INTEGER,
  height INTEGER,
  expand BOOLEAN DEFAULT FALSE,
  pin BOOLEAN DEFAULT FALSE,
  extra TEXT,
  body TEXT,
  style TEXT,
  track TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`

// Create indexes for better performance
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_tiles_column ON tiles(column_index)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_type ON tiles(type)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_year ON tiles(year)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_pin ON tiles(pin)'
]

try {
  console.log('Creating tiles table...')
  db.exec(createTilesTable)
  console.log('Tiles table created successfully')

  // Create indexes
  createIndexes.forEach((indexSQL, i) => {
    db.exec(indexSQL)
    console.log(`Index ${i + 1} created successfully`)
  })

  console.log('Database initialization complete')
} catch (err) {
  console.error('Error:', err.message)
} finally {
  db.close()
}
