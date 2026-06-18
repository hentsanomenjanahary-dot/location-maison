import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav style={{
      background: '#1a1d27',
      borderBottom: '0.5px solid #2d3148',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1.2rem' }}>
        MaisonMada
      </Link>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/mes-reservations">
              <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                Mes réservations
              </button>
            </Link>
            <Link to="/admin">
              <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                Admin
              </button>
            </Link>
            <button className="btn-secondary" onClick={handleSignOut} style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn-primary" style={{ padding: '8px 20px', width: 'auto' }}>
              Connexion
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}