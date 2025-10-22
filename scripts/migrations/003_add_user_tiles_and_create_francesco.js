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
    console.log('Running migration 003: Add full_name to users, user_id to tiles, and create Francesco user...')
    
    // Add full_name column to users table
    console.log('Adding full_name column to users table...')
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)
    `)
    console.log('full_name column added successfully')
    
    // Add user_id column to tiles table
    console.log('Adding user_id column to tiles table...')
    await client.query(`
      ALTER TABLE tiles 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(user_id)
    `)
    console.log('user_id column added successfully')
    
    // Create index for user_id in tiles table
    console.log('Creating index for user_id in tiles table...')
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tiles_user_id ON tiles(user_id)
    `)
    console.log('Index created successfully')
    
    // Check if Francesco user already exists
    const existingFrancesco = await client.query(
      'SELECT user_id FROM users WHERE email = $1',
      ['francesco@sullo.co']
    )
    
    if (existingFrancesco.rows.length > 0) {
      console.log('Francesco user already exists, skipping creation')
      
      // Still assign tiles to Francesco if they're not assigned yet
      const francescoUserId = existingFrancesco.rows[0].user_id
      const unassignedTiles = await client.query(
        'SELECT COUNT(*) FROM tiles WHERE user_id IS NULL'
      )
      
      if (parseInt(unassignedTiles.rows[0].count) > 0) {
        console.log('Assigning existing tiles to Francesco...')
        await client.query(
          'UPDATE tiles SET user_id = $1 WHERE user_id IS NULL',
          [francescoUserId]
        )
        console.log('Tiles assigned to Francesco successfully')
      }
      
      return
    }
    
    // Generate invitation code for Francesco
    const invitationCode = PasswordUtils.generateInvitationCode()
    console.log(`Generated invitation code: ${invitationCode}`)
    
    // Create invitation for Francesco
    console.log('Creating invitation for Francesco...')
    const invitationResult = await client.query(
      `INSERT INTO invitations (invitation_code, email, created_by, expires_at) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [invitationCode, 'francesco@sullo.co', 1, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] // 30 days from now
    )
    
    const invitationId = invitationResult.rows[0].id
    console.log(`Invitation created with ID: ${invitationId}`)
    
    // Generate password for Francesco
    const francescoPassword = PasswordUtils.generateTemporaryPassword()
    console.log(`Generated password for Francesco: ${francescoPassword}`)
    
    // Hash the password
    const passwordHash = await PasswordUtils.hashPassword(francescoPassword)
    
    // Create Francesco user
    console.log('Creating Francesco user...')
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, username, full_name, is_admin) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
      ['francesco@sullo.co', passwordHash, 'sullof', 'Francesco Sullo', false]
    )
    
    const francescoUserId = userResult.rows[0].user_id
    console.log(`Francesco user created with ID: ${francescoUserId}`)
    
    // Mark invitation as used
    console.log('Marking invitation as used...')
    await client.query(
      'UPDATE invitations SET is_used = true, used_at = CURRENT_TIMESTAMP WHERE id = $1',
      [invitationId]
    )
    console.log('Invitation marked as used')
    
    // Assign all existing tiles to Francesco
    console.log('Assigning all existing tiles to Francesco...')
    const tilesResult = await client.query(
      'UPDATE tiles SET user_id = $1 WHERE user_id IS NULL RETURNING id',
      [francescoUserId]
    )
    
    console.log(`Assigned ${tilesResult.rows.length} tiles to Francesco`)
    
    console.log('IMPORTANT: Save Francesco\'s credentials!')
    console.log(`Email: francesco@sullo.co`)
    console.log(`Password: ${francescoPassword}`)
    console.log(`Username: sullof`)
    console.log(`Full Name: Francesco Sullo`)
    
  } catch (err) {
    console.error('Migration 003 failed:', err.message)
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
