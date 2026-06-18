// import { useEffect, useState, useCallback } from 'react'
// import { supabase } from '../lib/supabaseClient'
// import { useAuth } from '../context/AuthContext'

// const statutStyle = {
//   confirme:   'badge-green',
//   en_attente: 'badge-amber',
//   annule:     'badge-red'
// }

// export default function MesReservations() {
//   const { user } = useAuth()
//   const [reservations, setReservations] = useState([])
//   const [loading, setLoading] = useState(true)

//   const charger = useCallback(async () => {
//     const { data } = await supabase
//       .from('reservations')
//       .select('*, maisons(titre, image_url, ville)')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })
//     setReservations(data || [])
//     setLoading(false)
//   }, [user.id])

//   // eslint-disable-next-line react-hooks/set-state-in-effect
//   useEffect(() => { charger() }, [charger])

//   const annuler = async (id) => {
//     await supabase.from('reservations').update({ statut:'annule' }).eq('id', id)
//     charger()
//   }

//   if (loading) return <div style={{ padding:'3rem', textAlign:'center', color:'#64748b' }}>Chargement...</div>

//   return (
//     <div className="page">
//       <h1 className="section-title">Mes réservations</h1>
//       {reservations.length === 0 && (
//         <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>
//           <p style={{ fontSize:'1.5rem' }}>📭</p>
//           <p>Aucune réservation pour l'instant.</p>
//         </div>
//       )}
//       <div style={{ display:'grid', gap:'1rem' }}>
//         {reservations.map(r => (
//           <div key={r.id} className="card" style={{ display:'grid', gridTemplateColumns:'100px 1fr auto', gap:'1rem', alignItems:'center', padding:'1rem' }}>
//             <img src={r.maisons?.image_url} alt={r.maisons?.titre}
//               style={{ width:'100px', height:'70px', objectFit:'cover', borderRadius:'8px' }}
//               onError={e => { e.target.src='https://placehold.co/100x70/1a1d27/64748b?text=Maison' }}
//             />
//             <div>
//               <p style={{ fontWeight:600, margin:'0 0 4px' }}>{r.maisons?.titre}</p>
//               <p style={{ fontSize:'0.85rem', color:'#64748b', margin:'0 0 6px' }}>📍 {r.maisons?.ville}</p>
//               <p style={{ fontSize:'0.85rem', color:'#94a3b8', margin:0 }}>
//                 {r.date_debut} → {r.date_fin} · {r.nb_nuits} nuit(s)
//               </p>
//               <span className={`badge ${statutStyle[r.statut] || 'badge-amber'}`} style={{ marginTop:'6px', display:'inline-block' }}>
//                 {r.statut}
//               </span>
//             </div>
//             <div style={{ textAlign:'right' }}>
//               <p style={{ fontWeight:700, color:'#a78bfa', fontSize:'1.1rem', margin:'0 0 8px' }}>{r.prix_total}€</p>
//               {r.statut !== 'annule' && (
//                 <button className="btn-danger" style={{ fontSize:'0.8rem' }} onClick={() => annuler(r.id)}>
//                   Annuler
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function Reservation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [maison, setMaison] = useState(null)
  const [dateDebut, setDateDebut] = useState(null)
  const [dateFin, setDateFin] = useState(null)
  const [datesOccupees, setDatesOccupees] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('maisons').select('*').eq('id', id).single()
      .then(({ data }) => setMaison(data))

    supabase.from('reservations')
      .select('date_debut, date_fin')
      .eq('maison_id', id)
      .neq('statut', 'annule')
      .then(({ data }) => {
        if (data) {
          const dates = []
          data.forEach(r => {
            let current = new Date(r.date_debut)
            const fin = new Date(r.date_fin)
            while (current <= fin) {
              dates.push(new Date(current))
              current.setDate(current.getDate() + 1)
            }
          })
          setDatesOccupees(dates)
        }
      })
  }, [id])

  const nbNuits = dateDebut && dateFin
    ? Math.max(0, Math.round((dateFin - dateDebut) / 86400000))
    : 0

  const prixTotal = maison ? nbNuits * maison.prix_par_nuit : 0

  const handleNext = () => {
    if (!dateDebut || !dateFin) { setError('Sélectionnez les dates.'); return }
    if (nbNuits <= 0) { setError('La date de fin doit être après la date de début.'); return }
    navigate('/paiement', {
      state: {
        maisonId: id,
        dateDebut: dateDebut.toISOString().split('T')[0],
        dateFin: dateFin.toISOString().split('T')[0],
        nbNuits,
        prixTotal,
        maisonTitre: maison.titre
      }
    })
  }

  if (!maison) return <div style={{ padding:'3rem', textAlign:'center', color:'#64748b' }}>Chargement...</div>

  return (
    <div className="page" style={{ maxWidth:'560px' }}>
      <h1 className="section-title">Réserver : {maison.titre}</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding:'1.5rem', marginBottom:'1.5rem' }}>
        <div className="form-group">
          <label>Date d'arrivée</label>
          <DatePicker
            selected={dateDebut}
            onChange={date => { setDateDebut(date); setError('') }}
            excludeDates={datesOccupees}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Choisir une date"
            className="datepicker-input"
          />
        </div>
        <div className="form-group">
          <label>Date de départ</label>
          <DatePicker
            selected={dateFin}
            onChange={date => { setDateFin(date); setError('') }}
            excludeDates={datesOccupees}
            minDate={dateDebut || new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Choisir une date"
            className="datepicker-input"
          />
        </div>

        {nbNuits > 0 && (
          <div style={{ background:'#0f1117', borderRadius:'8px', padding:'1rem', marginTop:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px', color:'#94a3b8', fontSize:'0.9rem' }}>
              <span>{maison.prix_par_nuit} € × {nbNuits} nuit(s)</span>
              <span>{prixTotal} €</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, color:'#a78bfa', fontSize:'1.1rem', borderTop:'0.5px solid #2d3148', paddingTop:'8px' }}>
              <span>Total</span>
              <span>{prixTotal} €</span>
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