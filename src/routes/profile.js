const express = require('express')
const router = express.Router()
const jsonParser = require('body-parser').json()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
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

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../static/img/avatars')
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Generate unique filename: user_id_timestamp.extension
    const userId = req.session.userId
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    cb(null, `user_${userId}_${timestamp}${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT user_id, email, username, full_name, avatar_url, is_admin, created_at FROM users WHERE user_id = $1',
        [req.session.userId]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ user: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Profile fetch error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user profile (username, full_name)
router.put('/profile', requireAuth, jsonParser, async (req, res) => {
  try {
    const { username, full_name } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    const client = await pool.connect()
    try {
      // Check if username is already taken by another user
      const existingUser = await client.query(
        'SELECT user_id FROM users WHERE username = $1 AND user_id != $2',
        [username, req.session.userId]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' })
      }

      // Update user profile
      const result = await client.query(
        'UPDATE users SET username = $1, full_name = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING user_id, email, username, full_name, avatar_url, is_admin',
        [username, full_name || null, req.session.userId]
      )

      res.json({ user: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Profile update error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Upload avatar
router.post('/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const client = await pool.connect()
    try {
      // Generate the URL for the uploaded file
      const avatarUrl = `/img/avatars/${req.file.filename}`

      // Update user's avatar URL
      await client.query(
        'UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [avatarUrl, req.session.userId]
      )

      res.json({ 
        message: 'Avatar uploaded successfully',
        avatar_url: avatarUrl
      })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Avatar upload error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Change password
router.post('/change-password', requireAuth, jsonParser, async (req, res) => {
  try {
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
