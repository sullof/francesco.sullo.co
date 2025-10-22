const express = require('express')
const router = express.Router()
const jsonParser = require('body-parser').json()
const { Pool } = require('pg')
const PasswordUtils = require('../lib/PasswordUtils')

// Database configuration
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

// Login endpoint
router.post('/login', jsonParser, async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT user_id, email, password_hash, username, is_admin FROM users WHERE email = $1',
        [email.toLowerCase()]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const user = result.rows[0]

      // Verify password
      const isValidPassword = await PasswordUtils.comparePassword(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      // Set session
      req.session.userId = user.user_id
      req.session.userEmail = user.email
      req.session.isAdmin = user.is_admin

      // Return user info (without password hash)
      res.json({
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          is_admin: user.is_admin
        }
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err.message)
      return res.status(500).json({ error: 'Could not log out' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

// Check authentication status
router.get('/me', async (req, res) => {
  try {
    console.log('Auth check - session:', req.session)
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT user_id, email, username, is_admin FROM users WHERE user_id = $1',
        [req.session.userId]
      )

      if (result.rows.length === 0) {
        // User not found, clear session
        req.session.destroy()
        return res.status(401).json({ error: 'User not found' })
      }

      res.json({
        user: result.rows[0]
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Auth check error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Change password endpoint
router.post('/change-password', jsonParser, async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' })
    }

    const client = await pool.connect()
    try {
      // Get current password hash
      const result = await client.query(
        'SELECT password_hash FROM users WHERE user_id = $1',
        [req.session.userId]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Verify current password
      const isValidPassword = await PasswordUtils.comparePassword(
        currentPassword, 
        result.rows[0].password_hash
      )

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' })
      }

      // Hash new password
      const newPasswordHash = await PasswordUtils.hashPassword(newPassword)

      // Update password
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [newPasswordHash, req.session.userId]
      )

      res.json({ message: 'Password changed successfully' })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Change password error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
