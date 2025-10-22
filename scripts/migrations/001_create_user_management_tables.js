require('dotenv').config()
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

// Create users table
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`

// Create invitations table
const createInvitationsTable = `
CREATE TABLE IF NOT EXISTS invitations (
  id SERIAL PRIMARY KEY,
  invitation_code VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_by INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_used BOOLEAN DEFAULT FALSE
)
`

// Create indexes for better performance
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
  'CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin)',
  'CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(invitation_code)',
  'CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email)',
  'CREATE INDEX IF NOT EXISTS idx_invitations_used ON invitations(is_used)'
]

async function runMigration() {
  const client = await pool.connect()
  
  try {
    console.log('Running migration 001: Create user management tables...')
    
    // Create users table
    console.log('Creating users table...')
    await client.query(createUsersTable)
    console.log('Users table created successfully')
    
    // Create invitations table
    console.log('Creating invitations table...')
    await client.query(createInvitationsTable)
    console.log('Invitations table created successfully')
    
    // Create indexes
    console.log('Creating indexes...')
    for (let i = 0; i < createIndexes.length; i++) {
      await client.query(createIndexes[i])
      console.log(`Index ${i + 1} created successfully`)
    }
    
    console.log('Migration 001 completed successfully')
    
  } catch (err) {
    console.error('Migration 001 failed:', err.message)
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
      pool.end()
    })
}

module.exports = runMigration
