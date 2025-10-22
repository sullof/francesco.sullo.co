require('dotenv').config()
const fs = require('fs')
const path = require('path')

// Database configuration
const { Pool } = require('pg')
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

// Create migrations table to track completed migrations
const createMigrationsTable = `
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`

async function runMigrations() {
  try {
    console.log('Starting migration process...')
    
    const client = await pool.connect()
    
    // Create migrations tracking table
    console.log('Creating migrations tracking table...')
    await client.query(createMigrationsTable)
    console.log('Migrations tracking table created')
    
    // Get list of completed migrations
    const completedResult = await client.query('SELECT migration_name FROM migrations')
    const completedMigrations = new Set(completedResult.rows.map(row => row.migration_name))
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort() // Ensure migrations run in order
    
    console.log(`Found ${migrationFiles.length} migration files`)
    
    // Run each migration
    for (const migrationFile of migrationFiles) {
      const migrationName = migrationFile.replace('.js', '')
      
      if (completedMigrations.has(migrationName)) {
        console.log(`Skipping ${migrationName} (already completed)`)
        continue
      }
      
      console.log(`Running migration: ${migrationName}`)
      
      try {
        // Import and run the migration
        const migration = require(path.join(migrationsDir, migrationFile))
        await migration()
        
        // Mark migration as completed
        await client.query(
          'INSERT INTO migrations (migration_name) VALUES ($1)',
          [migrationName]
        )
        
        console.log(`Migration ${migrationName} completed successfully`)
        
      } catch (err) {
        console.error(`Migration ${migrationName} failed:`, err.message)
        throw err
      }
    }
    
    console.log('All migrations completed successfully')
    
  } catch (err) {
    console.error('Migration process failed:', err.message)
    process.exit(1)
  } finally {
    console.log('Closing database connection...')
    
    // Try to close the pool, but don't wait forever
    pool.end().catch(() => {
      // Ignore errors when closing
    })
    
    // Force exit after a short delay
    setTimeout(() => {
      console.log('Database connection closed')
      process.exit(0)
    }, 100)
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
}

module.exports = runMigrations
