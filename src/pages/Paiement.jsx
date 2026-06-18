import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

function formatCard(v) {
  return v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
}
function formatExpiry(v) {
  return v.replace(/\D/g,'').slice(0,4).replace(/^(.{2})(.+)/,'$1/$2')
}

export default function Paiement() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [carte, setCarte]   = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv]       = useState('')
  const [nom, setNom]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  if (!state) return <div style={{ padding:'3rem', textAlign:'center', color:'#f87171' }}>Aucune réservation en cours.</div>

  const { maisonId, dateDebut, dateFin, nbNuits, prixTotal, maisonTitre } = state

  const valider = async () => {
    if (!carte || !expiry || !cvv || !nom) { setError('Remplissez tous les champs.'); return }
    if (carte.replace(/\s/g,'').length < 16) { setError('Numéro de carte invalide.'); return }
    setError(''); setLoading(true)

    await new Promise(r => setTimeout(r, 1800))

    const { error: dbErr } = await supabase.from('reservations').insert({
      maison_id: maisonId,
      user_id: user.id,
      date_debut: dateDebut,
      date_fin: dateFin,
      prix_total: prixTotal,
      statut: 'confirme',
      paiement_simule: {
        carte_masquee: '**** **** **** ' + carte.replace(/\s/g,'').slice(-4),
        nom_titulaire: nom,
        montant: prixTotal,
        date_paiement: new Date().toISOString()
      }
    })

    setLoading(false)
    if (dbErr) { setError('Erreur lors de la réservation : ' + dbErr.message); return }
    navigate('/confirmation', { state: { maisonTitre, nbNuits, prixTotal, dateDebut, dateFin } })
  }

  return (
    <div className="page" style={{ maxWidth:'520px' }}>
      <h1 className="section-title">Paiement</h1>

      <div className="card" style={{ padding:'1rem 1.5rem', marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ margin:0, fontWeight:600 }}>{maisonTitre}</p>
          <p style={{ margin:0, fontSize:'0.85rem', color:'#64748b' }}>{nbNuits} nuit(s) · {dateDebut} → {dateFin}</p>
        </div>
        <span style={{ fontSize:'1.3rem', fontWeight:700, color:'#a78bfa' }}>{prixTotal}€</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding:'1.5rem', marginBottom:'1rem' }}>
        <p style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'1.2rem' }}>
          🔒 Paiement simulé — aucune vraie transaction
        </p>
        <div className="form-group">
          <label>Nom sur la carte</label>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Jean Dupont" />
        </div>
        <div className="form-group">
          <label>Numéro de carte</label>
          <input value={carte} onChange={e => setCarte(formatCard(e.target.value))}
            placeholder="1234 5678 9012 3456" maxLength={19} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div className="form-group">
            <label>Expiration</label>
            <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/AA" maxLength={5} />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))}
              placeholder="123" maxLength={3} type="password" />
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={valider} disabled={loading} style={{ fontSize:'1rem' }}>
        {loading ? '⏳ Traitement en cours...' : `Payer ${prixTotal}€`}
      </button>
    </div>
  )
}