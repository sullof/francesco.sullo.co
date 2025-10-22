import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile/profile', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setFormData({
          username: data.user.username || '',
          full_name: data.user.full_name || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/profile/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          full_name: formData.full_name
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setMessage('Profile updated successfully!')
      } else {
        const error = await response.json()
        setError(error.error)
      }
    } catch (error) {
      setError('Failed to update profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (response.ok) {
        setMessage('Password changed successfully!')
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        const error = await response.json()
        setError(error.error)
      }
    } catch (error) {
      setError('Failed to change password')
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({
          ...prev,
          avatar_url: data.avatar_url
        }))
        setMessage('Avatar uploaded successfully!')
      } else {
        const error = await response.json()
        setError(error.error)
      }
    } catch (error) {
      setError('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e9ecef'
      }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Welcome, {user?.email}</span>
          {user?.is_admin && (
            <Link to="/admin" style={{ color: '#667eea', textDecoration: 'none' }}>
              Admin Panel
            </Link>
          )}
          <button 
            onClick={handleLogout}
            style={{ 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid #e9ecef'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            background: activeTab === 'profile' ? '#667eea' : 'transparent',
            color: activeTab === 'profile' ? 'white' : '#333',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab('tiles')}
          style={{
            background: activeTab === 'tiles' ? '#667eea' : 'transparent',
            color: activeTab === 'tiles' ? 'white' : '#333',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Your Tiles
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #c3e6cb'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Avatar Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Profile Picture</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: profile?.avatar_url 
                  ? `url(${profile.avatar_url})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {!profile?.avatar_url && (profile?.full_name ? profile.full_name.charAt(0) : profile?.email?.charAt(0).toUpperCase())}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  style={{ marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {uploading ? 'Uploading...' : 'Upload a new avatar (max 5MB)'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate}>
            <h3 style={{ marginBottom: '1rem' }}>Profile Information</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Update Profile
            </button>
          </form>

          {/* Password Change Form */}
          <form onSubmit={handlePasswordChange} style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e9ecef' }}>
            <h3 style={{ marginBottom: '1rem' }}>Change Password</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Change Password
            </button>
          </form>
        </div>
      )}

      {/* Tiles Tab */}
      {activeTab === 'tiles' && (
        <div style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>Your Tiles</h2>
          <p>Manage your personal tiles here.</p>
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            Tile management features coming soon...
          </p>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
