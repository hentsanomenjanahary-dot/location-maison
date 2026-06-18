import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function DetailMaison() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [maison, setMaison] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('maisons').select('*').eq('id', id).single()
      .then(({ data }) => { setMaison(data); setLoading(false) })
  }, [id])

  if (loading) return <div style={{ padding:'3rem', textAlign:'center', color:'#64748b' }}>Chargement...</div>
  if (!maison) return <div style={{ padding:'3rem', textAlign:'center', color:'#f87171' }}>Maison introuvable.</div>

  return (
    <div className="page" style={{ maxWidth:'860px' }}>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom:'1.5rem', width:'auto' }}>
        ← Retour
      </button>

      <img src={maison.image_url} alt={maison.titre}
        style={{ width:'100%', height:'420px', objectFit:'cover', borderRadius:'12px', display:'block', marginBottom:'2rem' }}
        onError={e => { e.target.src='https://placehold.co/860x420/1a1d27/64748b?text=Maison' }}
      />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:'8px' }}>{maison.titre}</h1>
          <p style={{ color:'#64748b', marginBottom:'1rem' }}>📍 {maison.ville}</p>
          <div style={{ display:'flex', gap:'12px', marginBottom:'1.5rem', flexWrap:'wrap' }}>
            <span className="badge badge-purple">🛏 {maison.nb_chambres} chambre(s)</span>
            <span className="badge badge-purple">👥 {maison.nb_personnes} personnes max</span>
            <span className={`badge Ar{maison.disponible ? 'badge-green' : 'badge-red'}`}>
              {maison.disponible ? 'Disponible' : 'Indisponible'}
            </span>
          </div>
          <p style={{ lineHeight:'1.8', color:'#94a3b8' }}>{maison.description}</p>
        </div>

        <div className="card" style={{ padding:'1.5rem', position:'sticky', top:'80px' }}>
          <p style={{ fontSize:'1.6rem', fontWeight:700, color:'#a78bfa', marginBottom:'4px' }}>
            {maison.prix_par_nuit}€
            <span style={{ fontSize:'1rem', fontWeight:400, color:'#64748b' }}> /nuit</span>
          </p>
          <div style={{ borderTop:'0.5px solid #2d3148', margin:'1rem 0', paddingTop:'1rem' }}>
            {maison.disponible && user ? (
              <Link to={`/reserver/${maison.id}`}>
                <button className="btn-primary">Réserver maintenant</button>
              </Link>
            ) : !user ? (
              <Link to="/login">
                <button className="btn-primary">Se connecter pour réserver</button>
              </Link>
            ) : (
              <button className="btn-primary" disabled>Indisponible</button>
            )}
          </div>
          <p style={{ fontSize:'0.8rem', color:'#64748b', textAlign:'center' }}>
            Paiement sécurisé · Annulation gratuite
          </p>
        </div>
      </div>
    </div>
  )
}