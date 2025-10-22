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

// Authentication middleware
const authMiddleware = {
  // Check if user is authenticated
  requireAuth: (req, res, next) => {
    if (req.session && req.session.userId) {
      return next()
    }
    
    // If it's an API request, return JSON error
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    // For web requests, redirect to login
    return res.redirect('/login')
  },

  // Check if user is admin
  requireAdmin: async (req, res, next) => {
    try {
      if (!req.session || !req.session.userId) {
        if (req.path.startsWith('/api/')) {
          return res.status(401).json({ error: 'Authentication required' })
        }
        return res.redirect('/login')
      }

      // Get user from database to check admin status
      const client = await pool.connect()
      try {
        const result = await client.query(
          'SELECT is_admin FROM users WHERE user_id = $1',
          [req.session.userId]
        )
        
        if (result.rows.length === 0) {
          // User not found, clear session
          req.session.destroy()
          if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'User not found' })
          }
          return res.redirect('/login')
        }

        if (!result.rows[0].is_admin) {
          if (req.path.startsWith('/api/')) {
            return res.status(403).json({ error: 'Admin access required' })
          }
          return res.status(403).send('Admin access required')
        }

        next()
      } finally {
        client.release()
      }
    } catch (err) {
      console.error('Admin check error:', err.message)
      if (req.path.startsWith('/api/')) {
        return res.status(500).json({ error: 'Internal server error' })
      }
      return res.status(500).send('Internal server error')
    }
  },

  // Optional auth - adds user info to request if logged in
  optionalAuth: async (req, res, next) => {
    try {
      if (req.session && req.session.userId) {
        const client = await pool.connect()
        try {
          const result = await client.query(
            'SELECT user_id, email, username, is_admin FROM users WHERE user_id = $1',
            [req.session.userId]
          )
          
          if (result.rows.length > 0) {
            req.user = result.rows[0]
          }
        } finally {
          client.release()
        }
      }
      next()
    } catch (err) {
      console.error('Optional auth error:', err.message)
      next() // Continue even if there's an error
    }
  }
}

module.exports = authMiddleware
