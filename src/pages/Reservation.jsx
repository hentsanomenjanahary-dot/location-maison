import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Reservation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [maison, setMaison] = useState(null)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin]   = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('maisons').select('*').eq('id', id).single()
      .then(({ data }) => setMaison(data))
  }, [id])

  const today = new Date().toISOString().split('T')[0]

  const nbNuits = dateDebut && dateFin
    ? Math.max(0, Math.round((new Date(dateFin) - new Date(dateDebut)) / 86400000))
    : 0

  const prixTotal = maison ? nbNuits * maison.prix_par_nuit : 0

  const handleNext = () => {
    if (!dateDebut || !dateFin) { setError('Sélectionnez les dates.'); return }
    if (nbNuits <= 0) { setError('La date de fin doit être après la date de début.'); return }
    navigate('/paiement', { state: { maisonId: id, dateDebut, dateFin, nbNuits, prixTotal, maisonTitre: maison.titre } })
  }

  if (!maison) return <div style={{ padding:'3rem', textAlign:'center', color:'#64748b' }}>Chargement...</div>

  return (
    <div className="page" style={{ maxWidth:'560px' }}>
      <h1 className="section-title">Réserver : {maison.titre}</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding:'1.5rem', marginBottom:'1.5rem' }}>
        <div className="form-group">
          <label>Date d'arrivée</label>
          <input type="date" value={dateDebut} min={today}
            onChange={e => { setDateDebut(e.target.value); setError('') }} />
        </div>
        <div className="form-group">
          <label>Date de départ</label>
          <input type="date" value={dateFin} min={dateDebut || today}
            onChange={e => { setDateFin(e.target.value); setError('') }} />
        </div>

        {nbNuits > 0 && (
          <div style={{ background:'#0f1117', borderRadius:'8px', padding:'1rem', marginTop:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px', color:'#94a3b8', fontSize:'0.9rem' }}>
              <span>{maison.prix_par_nuit}€ × {nbNuits} nuit(s)</span>
              <span>{prixTotal}€</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, color:'#a78bfa', fontSize:'1.1rem', borderTop:'0.5px solid #2d3148', paddingTop:'8px' }}>
              <span>Total</span>
              <span>{prixTotal}€</span>
            </div>
          </div>
        )}
      </div>

      <button className="btn-primary" onClick={handleNext} disabled={nbNuits <= 0}>
        Continuer vers le paiement →
      </button>
    </div>
  )
}