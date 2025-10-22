import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', margin: '0 0 2rem 0', opacity: 0.9 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        style={{ 
          color: 'white', 
          textDecoration: 'none',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '1rem 2rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          fontSize: '1.1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.3)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
      >
        Go Home
      </Link>
    </div>
  )
}

export default NotFoundPage
