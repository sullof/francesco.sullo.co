import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user?.is_admin) {
    navigate('/dashboard')
    return null
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Panel</h1>
        <Link to="/dashboard" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>User Management</h2>
          <p>Manage users and invitations.</p>
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            Admin features coming soon...
          </p>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>System Settings</h2>
          <p>Configure system-wide settings.</p>
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            Settings panel coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
