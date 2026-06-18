import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    const fn = mode === 'login' ? signIn : signUp
    const err = await fn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    if (mode === 'login') navigate('/')
    else setSuccess('Compte créé ! Vérifiez votre email puis connectez-vous.')
  }

  return (
    <div style={{ minHeight:'90vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div className="card" style={{ padding:'2rem' }}>
          <h2 style={{ textAlign:'center', marginBottom:'1.5rem', color:'#a78bfa', fontSize:'1.4rem' }}>
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handle}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@example.com" />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:'0.5rem' }}>
              {loading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'Créer le compte')}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.2rem', fontSize:'0.9rem', color:'#64748b' }}>
            {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
            {' '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              style={{ background:'none', border:'none', color:'#a78bfa', cursor:'pointer', padding:0, fontSize:'0.9rem' }}>
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
        <p style={{ textAlign:'center', marginTop:'1rem' }}>
          <Link to="/" style={{ color:'#64748b', fontSize:'0.85rem' }}>← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  )
}