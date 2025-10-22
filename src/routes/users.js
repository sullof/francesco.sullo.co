require('dotenv').config()
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

// Register with invitation code
router.post('/register', jsonParser, async (req, res) => {
  try {
    const { invitationCode, email, password, username } = req.body

    if (!invitationCode || !email || !password) {
      return res.status(400).json({ error: 'Invitation code, email, and password are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const client = await pool.connect()
    try {
      // Start transaction
      await client.query('BEGIN')

      try {
        // Find and validate invitation
        const invitationResult = await client.query(
          `SELECT id, email, expires_at, is_used 
           FROM invitations 
           WHERE invitation_code = $1 AND is_used = false`,
          [invitationCode]
        )

        if (invitationResult.rows.length === 0) {
          await client.query('ROLLBACK')
          return res.status(400).json({ error: 'Invalid or expired invitation code' })
        }

        const invitation = invitationResult.rows[0]

        // Check if invitation is expired
        if (new Date() > new Date(invitation.expires_at)) {
          await client.query('ROLLBACK')
          return res.status(400).json({ error: 'Invitation code has expired' })
        }

        // Check if email matches invitation
        if (invitation.email.toLowerCase() !== email.toLowerCase()) {
          await client.query('ROLLBACK')
          return res.status(400).json({ error: 'Email does not match invitation' })
        }

        // Check if user already exists
        const existingUser = await client.query(
          'SELECT user_id FROM users WHERE email = $1',
          [email.toLowerCase()]
        )

        if (existingUser.rows.length > 0) {
          await client.query('ROLLBACK')
          return res.status(400).json({ error: 'User with this email already exists' })
        }

        // Check if username is taken (if provided)
        if (username) {
          const existingUsername = await client.query(
            'SELECT user_id FROM users WHERE username = $1',
            [username]
          )

          if (existingUsername.rows.length > 0) {
            await client.query('ROLLBACK')
            return res.status(400).json({ error: 'Username is already taken' })
          }
        }

        // Hash password
        const passwordHash = await PasswordUtils.hashPassword(password)

        // Create user
        const userResult = await client.query(
          `INSERT INTO users (email, password_hash, username, is_admin) 
           VALUES ($1, $2, $3, $4) 
           RETURNING user_id, email, username, is_admin, created_at`,
          [email.toLowerCase(), passwordHash, username || null, false]
        )

        const user = userResult.rows[0]

        // Mark invitation as used
        await client.query(
          'UPDATE invitations SET is_used = true, used_at = CURRENT_TIMESTAMP WHERE id = $1',
          [invitation.id]
        )

        // Commit transaction
        await client.query('COMMIT')

        res.json({
          message: 'Registration successful',
          user: {
            user_id: user.user_id,
            email: user.email,
            username: user.username,
            is_admin: user.is_admin,
            created_at: user.created_at
          }
        })
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      }
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Registration error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Validate invitation code (check if it's valid without using it)
router.post('/validate-invitation', jsonParser, async (req, res) => {
  try {
    const { invitationCode, email } = req.body

    if (!invitationCode || !email) {
      return res.status(400).json({ error: 'Invitation code and email are required' })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT id, email, expires_at, is_used 
         FROM invitations 
         WHERE invitation_code = $1`,
        [invitationCode]
      )

      if (result.rows.length === 0) {
        return res.json({ valid: false, error: 'Invalid invitation code' })
      }

      const invitation = result.rows[0]

      if (invitation.is_used) {
        return res.json({ valid: false, error: 'Invitation code has already been used' })
      }

      if (new Date() > new Date(invitation.expires_at)) {
        return res.json({ valid: false, error: 'Invitation code has expired' })
      }

      if (invitation.email.toLowerCase() !== email.toLowerCase()) {
        return res.json({ valid: false, error: 'Email does not match invitation' })
      }

      res.json({ valid: true })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Validate invitation error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
