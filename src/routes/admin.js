require('dotenv').config()
const express = require('express')
const router = express.Router()
const jsonParser = require('body-parser').json()
const { Pool } = require('pg')
const PasswordUtils = require('../lib/PasswordUtils')
const authMiddleware = require('../lib/authMiddleware')

// Database configuration
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'tiles_db',
  ssl: false
})

// Generate a new invitation
router.post('/invitations', authMiddleware.requireAdmin, jsonParser, async (req, res) => {
  try {
    const { email, expiresInDays = 7 } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const client = await pool.connect()
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT user_id FROM users WHERE email = $1',
        [email.toLowerCase()]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' })
      }

      // Check if there's already an unused invitation for this email
      const existingInvitation = await client.query(
        'SELECT id FROM invitations WHERE email = $1 AND is_used = false AND expires_at > NOW()',
        [email.toLowerCase()]
      )

      if (existingInvitation.rows.length > 0) {
        return res.status(400).json({ error: 'An active invitation already exists for this email' })
      }

      // Generate invitation code
      const invitationCode = PasswordUtils.generateInvitationCode()
      
      // Calculate expiration date
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)

      // Create invitation
      const result = await client.query(
        `INSERT INTO invitations (invitation_code, email, created_by, expires_at) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, invitation_code, email, created_at, expires_at`,
        [invitationCode, email.toLowerCase(), req.session.userId, expiresAt]
      )

      const invitation = result.rows[0]

      res.json({
        invitation: {
          id: invitation.id,
          invitation_code: invitation.invitation_code,
          email: invitation.email,
          created_at: invitation.created_at,
          expires_at: invitation.expires_at
        }
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Create invitation error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// List all invitations
router.get('/invitations', authMiddleware.requireAdmin, async (req, res) => {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT i.id, i.invitation_code, i.email, i.created_at, i.used_at, i.expires_at, i.is_used,
                u.email as created_by_email
         FROM invitations i
         LEFT JOIN users u ON i.created_by = u.user_id
         ORDER BY i.created_at DESC`
      )

      const invitations = result.rows.map(row => ({
        id: row.id,
        invitation_code: row.invitation_code,
        email: row.email,
        created_at: row.created_at,
        used_at: row.used_at,
        expires_at: row.expires_at,
        is_used: row.is_used,
        created_by_email: row.created_by_email,
        is_expired: new Date() > new Date(row.expires_at)
      }))

      res.json({ invitations })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('List invitations error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Revoke an invitation
router.delete('/invitations/:id', authMiddleware.requireAdmin, async (req, res) => {
  try {
    const invitationId = parseInt(req.params.id)

    if (isNaN(invitationId)) {
      return res.status(400).json({ error: 'Invalid invitation ID' })
    }

    const client = await pool.connect()
    try {
      // Check if invitation exists and is not used
      const existingInvitation = await client.query(
        'SELECT id, is_used FROM invitations WHERE id = $1',
        [invitationId]
      )

      if (existingInvitation.rows.length === 0) {
        return res.status(404).json({ error: 'Invitation not found' })
      }

      if (existingInvitation.rows[0].is_used) {
        return res.status(400).json({ error: 'Cannot revoke a used invitation' })
      }

      // Delete the invitation
      await client.query('DELETE FROM invitations WHERE id = $1', [invitationId])

      res.json({ message: 'Invitation revoked successfully' })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Revoke invitation error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// List all users (admin only)
router.get('/users', authMiddleware.requireAdmin, async (req, res) => {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT user_id, email, username, is_admin, created_at, updated_at
         FROM users
         ORDER BY created_at DESC`
      )

      const users = result.rows.map(row => ({
        user_id: row.user_id,
        email: row.email,
        username: row.username,
        is_admin: row.is_admin,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))

      res.json({ users })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('List users error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete a user (admin only)
router.delete('/users/:id', authMiddleware.requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id)

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    // Prevent admin from deleting themselves
    if (userId === req.session.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }

    const client = await pool.connect()
    try {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT user_id, is_admin FROM users WHERE user_id = $1',
        [userId]
      )

      if (existingUser.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Prevent deleting other admins
      if (existingUser.rows[0].is_admin) {
        return res.status(400).json({ error: 'Cannot delete admin users' })
      }

      // Delete user (this will also delete their tiles due to foreign key constraints)
      await client.query('DELETE FROM users WHERE user_id = $1', [userId])

      res.json({ message: 'User deleted successfully' })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Delete user error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
