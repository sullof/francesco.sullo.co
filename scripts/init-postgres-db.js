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

// Create tiles table
const createTilesTable = `
CREATE TABLE IF NOT EXISTS tiles (
  id SERIAL PRIMARY KEY,
  column_index INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT,
  subtitle TEXT,
  year VARCHAR(10),
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
  body JSONB,
  style JSONB,
  track TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`

// Create indexes for better performance
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_tiles_column ON tiles(column_index)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_type ON tiles(type)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_year ON tiles(year)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_pin ON tiles(pin)',
  'CREATE INDEX IF NOT EXISTS idx_tiles_created_at ON tiles(created_at)'
]

async function initDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...')
    
    // Test connection
    const client = await pool.connect()
    console.log('Connected to PostgreSQL database successfully')
    
    // Create tiles table
    console.log('Creating tiles table...')
    await client.query(createTilesTable)
    console.log('Tiles table created successfully')
    
    // Create indexes
    console.log('Creating indexes...')
    for (let i = 0; i < createIndexes.length; i++) {
      await client.query(createIndexes[i])
      console.log(`Index ${i + 1} created successfully`)
    }
    
    console.log('Database initialization complete')
    
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run initialization
initDatabase()
