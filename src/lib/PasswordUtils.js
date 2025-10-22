const bcrypt = require('bcryptjs')

// Password hashing utilities
const PasswordUtils = {
  // Hash a password with salt rounds
  async hashPassword(password) {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  },

  // Compare a password with its hash
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash)
  },

  // Generate a random invitation code
  generateInvitationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Generate a temporary password
  generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

module.exports = PasswordUtils
