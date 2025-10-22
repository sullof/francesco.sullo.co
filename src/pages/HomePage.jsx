import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      color: '#333',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
          Hooq
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/explore" style={{ color: '#333', textDecoration: 'none' }}>
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: '#333', textDecoration: 'none' }}>
                Dashboard
              </Link>
              {user.is_admin && (
                <Link to="/admin" style={{ color: '#333', textDecoration: 'none' }}>
                  Admin
                </Link>
              )}
              <button 
                onClick={() => window.location.href = '/api/auth/logout'}
                style={{ 
                  background: 'none', 
                  color: '#333', 
                  border: '1px solid #333', 
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#333', textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: '#333', textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 1rem 0',
          fontWeight: '300',
          color: '#333'
        }}>
          Hooq
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          margin: '0 0 3rem 0', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          A platform for curating and sharing your digital collections. 
          Create your own space to showcase what matters to you.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link 
            to="/explore" 
            style={{ 
              background: 'white',
              color: '#333',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid #e9ecef',
              fontSize: '1.1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Explore Collections
          </Link>
          
          {!user && (
            <Link 
              to="/register" 
              style={{ 
                background: '#333',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#555'
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#333'
              }}
            >
              Get Started
            </Link>
          )}
        </div>

        {!user && (
          <p style={{ 
            marginTop: '2rem', 
            color: '#999',
            fontSize: '0.9rem'
          }}>
            Need an invitation code? Contact an existing user or administrator.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#999',
        fontSize: '0.9rem',
        borderTop: '1px solid #e9ecef',
        background: 'white'
      }}>
        <p>© 2024 Hooq. A platform for digital collections.</p>
      </footer>
    </div>
  )
}

export default HomePage
