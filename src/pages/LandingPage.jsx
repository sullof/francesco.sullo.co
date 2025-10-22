import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LongLandingPage from './LongLandingPage'

const LandingPage = () => {
  const { user } = useAuth()

  return (
    <div>
      {/* Navigation bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          Francesco Sullo
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>
                Dashboard
              </Link>
              {user.is_admin && (
                <Link to="/admin" style={{ textDecoration: 'none', color: '#333' }}>
                  Admin
                </Link>
              )}
              <button 
                onClick={() => window.location.href = '/api/auth/logout'}
                style={{ 
                  background: 'none', 
                  border: '1px solid #333', 
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>
                Login
              </Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main content with top padding to account for fixed nav */}
      <div style={{ paddingTop: '80px' }}>
        <LongLandingPage />
      </div>
    </div>
  )
}

export default LandingPage
