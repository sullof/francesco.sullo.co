require('dotenv').config()
const { Pool } = require('pg')
const PasswordUtils = require('../../src/lib/PasswordUtils')

// Database configuration
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
    console.log('Running migration 002: Create initial admin user...')
    
    // Check if admin user already exists
    const existingAdmin = await client.query(
      'SELECT user_id FROM users WHERE email = $1',
      ['hooq@sullo.co']
    )
    
    if (existingAdmin.rows.length > 0) {
      console.log('Admin user hooq@sullo.co already exists, skipping creation')
      return
    }
    
    // Generate temporary password
    const temporaryPassword = PasswordUtils.generateTemporaryPassword()
    console.log(`Generated temporary password: ${temporaryPassword}`)
    
    // Hash the password
    const passwordHash = await PasswordUtils.hashPassword(temporaryPassword)
    
    // Create admin user
    console.log('Creating admin user hooq@sullo.co...')
    const result = await client.query(
      `INSERT INTO users (email, password_hash, username, is_admin) 
       VALUES ($1, $2, $3, $4) 
       RETURNING user_id`,
      ['hooq@sullo.co', passwordHash, 'hooq', true]
    )
    
    const userId = result.rows[0].user_id
    console.log(`Admin user created with ID: ${userId}`)
    console.log('IMPORTANT: Save this temporary password - it will not be shown again!')
    console.log(`Temporary password: ${temporaryPassword}`)
    
  } catch (err) {
    console.error('Migration 002 failed:', err.message)
    throw err
  } finally {
    client.release()
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration completed')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Migration failed:', err.message)
      process.exit(1)
    })
    .finally(() => {
      pool.end().catch(() => {})
      setTimeout(() => process.exit(0), 100)
    })
}

module.exports = runMigration
