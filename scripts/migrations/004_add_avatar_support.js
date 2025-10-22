require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

async function runMigration() {
  const client = await pool.connect()
  try {
    // Add avatar_url column to users table
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500)
    `)
    
    // Update Francesco's avatar
    await client.query(`
      UPDATE users 
      SET avatar_url = 'https://francesco.sullo.co/img/blackglassed.jpg'
      WHERE username = 'sullof'
    `)
    
    console.log('Avatar support added successfully')
    console.log('Francesco\'s avatar URL set to: https://francesco.sullo.co/img/blackglassed.jpg')
  } catch (err) {
    console.error('Migration failed:', err.message)
    throw err
  } finally {
    client.release()
  }
}

module.exports = runMigration
