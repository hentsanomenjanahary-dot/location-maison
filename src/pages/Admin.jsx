// import { useEffect, useState } from 'react'
// import { supabase } from '../lib/supabaseClient'

// const vide = { titre:'', description:'', prix_par_nuit:'', ville:'', nb_chambres:1, nb_personnes:2, image_url:'', disponible:true }

// export default function Admin() {
//   const [maisons, setMaisons] = useState([])
//   const [form, setForm] = useState(vide)
//   const [editId, setEditId] = useState(null)
//   const [tab, setTab] = useState('maisons')
//   const [reservations, setReservations] = useState([])
//   const [msg, setMsg] = useState('')

//   const charger = async () => {
//     const { data } = await supabase.from('maisons').select('*').order('created_at', { ascending:false })
//     setMaisons(data || [])
//     const { data: r } = await supabase.from('reservations').select('*, maisons(titre)').order('created_at', { ascending:false })
//     setReservations(r || [])
//   }

//   // eslint-disable-next-line react-hooks/set-state-in-effect
//   useEffect(() => { charger() }, [])

//   const sauvegarder = async () => {
//     const data = { ...form, prix_par_nuit: Number(form.prix_par_nuit), nb_chambres: Number(form.nb_chambres), nb_personnes: Number(form.nb_personnes) }
//     if (editId) await supabase.from('maisons').update(data).eq('id', editId)
//     else await supabase.from('maisons').insert(data)
//     setForm(vide); setEditId(null); setMsg('Sauvegardé !'); charger()
//     setTimeout(() => setMsg(''), 2000)
//   }

//   const supprimer = async (id) => {
//     if (!confirm('Supprimer cette maison ?')) return
//     await supabase.from('maisons').delete().eq('id', id)
//     charger()
//   }

//   const editer = (m) => { setForm(m); setEditId(m.id); setTab('form') }

//   const tabStyle = (t) => ({
//     padding: '10px 20px', background: tab === t ? '#2d2060' : 'transparent',
//     color: tab === t ? '#a78bfa' : '#64748b', border: '0.5px solid #2d3148',
//     borderRadius: '8px', cursor: 'pointer', marginRight: '8px'
//   })

//   return (
//     <div className="page">
//       <h1 className="section-title">Panneau Admin</h1>

//       <div style={{ marginBottom:'1.5rem' }}>
//         <button style={tabStyle('maisons')} onClick={() => setTab('maisons')}>Maisons ({maisons.length})</button>
//         <button style={tabStyle('reservations')} onClick={() => setTab('reservations')}>Réservations ({reservations.length})</button>
//         <button style={tabStyle('form')} onClick={() => { setTab('form'); setForm(vide); setEditId(null) }}>
//           + Ajouter
//         </button>
//       </div>

//       {msg && <div className="alert alert-success">{msg}</div>}

//       {tab === 'maisons' && (
//         <div style={{ display:'grid', gap:'0.8rem' }}>
//           {maisons.map(m => (
//             <div key={m.id} className="card" style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:'1rem', alignItems:'center', padding:'0.8rem 1rem' }}>
//               <img src={m.image_url} alt={m.titre}
//                 style={{ width:'80px', height:'55px', objectFit:'cover', borderRadius:'6px' }}
//                 onError={e => { e.target.src='https://placehold.co/80x55/1a1d27/64748b?text=Img' }}
//               />
//               <div>
//                 <p style={{ fontWeight:600, margin:'0 0 2px' }}>{m.titre}</p>
//                 <p style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>{m.ville} · {m.prix_par_nuit}€/nuit</p>
//                 <span className={`badge ${m.disponible ? 'badge-green' : 'badge-red'}`} style={{ marginTop:'4px', display:'inline-block' }}>
//                   {m.disponible ? 'Disponible' : 'Indisponible'}
//                 </span>
//               </div>
//               <div style={{ display:'flex', gap:'8px' }}>
//                 <button className="btn-secondary" style={{ padding:'6px 12px', fontSize:'0.82rem' }} onClick={() => editer(m)}>Modifier</button>
//                 <button className="btn-danger" style={{ padding:'6px 12px', fontSize:'0.82rem' }} onClick={() => supprimer(m.id)}>Supprimer</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {tab === 'reservations' && (
//         <div style={{ display:'grid', gap:'0.8rem' }}>
//           {reservations.map(r => (
//             <div key={r.id} className="card" style={{ padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
//               <div>
//                 <p style={{ fontWeight:600, margin:'0 0 4px' }}>{r.maisons?.titre}</p>
//                 <p style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>
//                   {r.date_debut} → {r.date_fin} · {r.nb_nuits} nuit(s)
//                 </p>
//               </div>
//               <div style={{ textAlign:'right' }}>
//                 <p style={{ fontWeight:700, color:'#a78bfa', margin:'0 0 4px' }}>{r.prix_total}€</p>
//                 <span className={`badge ${r.statut==='confirme' ? 'badge-green' : r.statut==='annule' ? 'badge-red' : 'badge-amber'}`}>
//                   {r.statut}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {tab === 'form' && (
//         <div className="card" style={{ padding:'1.5rem', maxWidth:'600px' }}>
//           <h3 style={{ marginBottom:'1.2rem', color:'#a78bfa' }}>{editId ? 'Modifier' : 'Ajouter'} une maison</h3>
//           {['titre','ville','image_url'].map(f => (
//             <div key={f} className="form-group">
//               <label style={{ textTransform:'capitalize' }}>{f.replace('_',' ')}</label>
//               <input value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
//             </div>
//           ))}
//           <div className="form-group">
//             <label>Description</label>
//             <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ resize:'vertical' }} />
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
//             {[['prix_par_nuit','Prix/nuit (€)'],['nb_chambres','Chambres'],['nb_personnes','Personnes']].map(([f,l]) => (
//               <div key={f} className="form-group">
//                 <label>{l}</label>
//                 <input type="number" value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
//               </div>
//             ))}
//           </div>
//           <div className="form-group" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
//             <input type="checkbox" id="dispo" checked={form.disponible}
//               onChange={e => setForm({...form, disponible: e.target.checked})}
//               style={{ width:'auto' }} />
//             <label htmlFor="dispo" style={{ marginBottom:0 }}>Disponible</label>
//           </div>
//           <div style={{ display:'flex', gap:'12px', marginTop:'0.5rem' }}>
//             <button className="btn-primary" onClick={sauvegarder}>Sauvegarder</button>
//             <button className="btn-secondary" onClick={() => { setForm(vide); setEditId(null) }}>Annuler</button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const vide = { titre:'', description:'', prix_par_nuit:'', ville:'', nb_chambres:1, nb_personnes:2, image_url:'', disponible:true }

export default function Admin() {
  const [maisons, setMaisons] = useState([])
  const [form, setForm] = useState(vide)
  const [editId, setEditId] = useState(null)
  const [tab, setTab] = useState('maisons')
  const [reservations, setReservations] = useState([])
  const [msg, setMsg] = useState('')

  const charger = async () => {
    const { data } = await supabase.from('maisons').select('*').order('created_at', { ascending:false })
    setMaisons(data || [])
    const { data: r } = await supabase.from('reservations').select('*, maisons(titre)').order('created_at', { ascending:false })
    setReservations(r || [])
  }

  const verifierExpirations = async () => {
    const { error } = await supabase.rpc('check_expiration_reservations')
    if (!error) { setMsg('Expirations vérifiées !'); charger() }
    else setMsg('Erreur : ' + error.message)
    setTimeout(() => setMsg(''), 2000)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { charger() }, [])

  const sauvegarder = async () => {
    const data = { ...form, prix_par_nuit: Number(form.prix_par_nuit), nb_chambres: Number(form.nb_chambres), nb_personnes: Number(form.nb_personnes) }
    if (editId) await supabase.from('maisons').update(data).eq('id', editId)
    else await supabase.from('maisons').insert(data)
    setForm(vide); setEditId(null); setMsg('Sauvegardé !'); charger()
    setTimeout(() => setMsg(''), 2000)
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette maison ?')) return
    await supabase.from('maisons').delete().eq('id', id)
    charger()
  }

  const editer = (m) => { setForm(m); setEditId(m.id); setTab('form') }

  const tabStyle = (t) => ({
    padding: '10px 20px', background: tab === t ? '#2d2060' : 'transparent',
    color: tab === t ? '#a78bfa' : '#64748b', border: '0.5px solid #2d3148',
    borderRadius: '8px', cursor: 'pointer', marginRight: '8px'
  })

  return (
    <div className="page">
      <h1 className="section-title">Panneau Admin</h1>

      <div style={{ marginBottom:'1.5rem', display:'flex', flexWrap:'wrap', gap:'8px' }}>
        <button style={tabStyle('maisons')} onClick={() => setTab('maisons')}>Maisons ({maisons.length})</button>
        <button style={tabStyle('reservations')} onClick={() => setTab('reservations')}>Réservations ({reservations.length})</button>
        <button style={tabStyle('form')} onClick={() => { setTab('form'); setForm(vide); setEditId(null) }}>
          + Ajouter
        </button>
        <button style={{ padding:'10px 20px', background:'#065f46', color:'#4ade80', border:'0.5px solid #14532d', borderRadius:'8px', cursor:'pointer' }}
          onClick={verifierExpirations}>
          🔄 Vérifier expirations
        </button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {tab === 'maisons' && (
        <div style={{ display:'grid', gap:'0.8rem' }}>
          {maisons.map(m => (
            <div key={m.id} className="card" style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:'1rem', alignItems:'center', padding:'0.8rem 1rem' }}>
              <img src={m.image_url} alt={m.titre}
                style={{ width:'80px', height:'55px', objectFit:'cover', borderRadius:'6px' }}
                onError={e => { e.target.src='https://placehold.co/80x55/1a1d27/64748b?text=Img' }}
              />
              <div>
                <p style={{ fontWeight:600, margin:'0 0 2px' }}>{m.titre}</p>
                <p style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>{m.ville} · {m.prix_par_nuit}€/nuit</p>
                <span className={`badge ${m.disponible ? 'badge-green' : 'badge-red'}`} style={{ marginTop:'4px', display:'inline-block' }}>
                  {m.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button className="btn-secondary" style={{ padding:'6px 12px', fontSize:'0.82rem' }} onClick={() => editer(m)}>Modifier</button>
                <button className="btn-danger" style={{ padding:'6px 12px', fontSize:'0.82rem' }} onClick={() => supprimer(m.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reservations' && (
        <div style={{ display:'grid', gap:'0.8rem' }}>
          {reservations.map(r => (
            <div key={r.id} className="card" style={{ padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontWeight:600, margin:'0 0 4px' }}>{r.maisons?.titre}</p>
                <p style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>
                  {r.date_debut} → {r.date_fin} · {r.nb_nuits} nuit(s)
                </p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontWeight:700, color:'#a78bfa', margin:'0 0 4px' }}>{r.prix_total}€</p>
                <span className={`badge ${r.statut==='confirme' ? 'badge-green' : r.statut==='annule' ? 'badge-red' : 'badge-amber'}`}>
                  {r.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'form' && (
        <div className="card" style={{ padding:'1.5rem', maxWidth:'600px' }}>
          <h3 style={{ marginBottom:'1.2rem', color:'#a78bfa' }}>{editId ? 'Modifier' : 'Ajouter'} une maison</h3>
          {['titre','ville','image_url'].map(f => (
            <div key={f} className="form-group">
              <label style={{ textTransform:'capitalize' }}>{f.replace('_',' ')}</label>
              <input value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
            </div>
          ))}
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ resize:'vertical' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
            {[['prix_par_nuit','Prix/nuit (€)'],['nb_chambres','Chambres'],['nb_personnes','Personnes']].map(([f,l]) => (
              <div key={f} className="form-group">
                <label>{l}</label>
                <input type="number" value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
              </div>
            ))}
          </div>
          <div className="form-group" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <input type="checkbox" id="dispo" checked={form.disponible}
              onChange={e => setForm({...form, disponible: e.target.checked})}
              style={{ width:'auto' }} />
            <label htmlFor="dispo" style={{ marginBottom:0 }}>Disponible</label>
          </div>
          <div style={{ display:'flex', gap:'12px', marginTop:'0.5rem' }}>
            <button className="btn-primary" onClick={sauvegarder}>Sauvegarder</button>
            <button className="btn-secondary" onClick={() => { setForm(vide); setEditId(null) }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  )
}