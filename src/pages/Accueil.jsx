import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import CarteMaison from '../components/CarteMaison'
import FiltreMaisons from '../components/FiltreMaisons'

export default function Accueil() {
  const [maisons, setMaisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtres, setFiltres] = useState({ ville:'', prixMax:'', chambres:'', personnes:'' })

  useEffect(() => {
    async function charger() {
      setLoading(true)
      let q = supabase.from('maisons').select('*')
      if (filtres.ville)     q = q.eq('ville', filtres.ville)
      if (filtres.prixMax)   q = q.lte('prix_par_nuit', filtres.prixMax)
      if (filtres.chambres)  q = q.gte('nb_chambres', filtres.chambres)
      if (filtres.personnes) q = q.gte('nb_personnes', filtres.personnes)
      const { data } = await q.order('created_at', { ascending: false })
      setMaisons(data || [])
      setLoading(false)
    }
    charger()
  }, [filtres])

  return (
    <div className="page">
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:700, color:'#e2e8f0', marginBottom:'4px' }}>
          Trouvez votre logement
        </h1>
        <p style={{ color:'#64748b' }}>{maisons.length} logement(s) trouvé(s)</p>
      </div>

      <FiltreMaisons filtres={filtres} onChange={setFiltres} />

      {loading && (
        <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>Chargement...</div>
      )}

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
        gap:'1.5rem'
      }}>
        {maisons.map(m => <CarteMaison key={m.id} maison={m} />)}
      </div>

      {!loading && maisons.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem', color:'#64748b' }}>
          <p style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>🔍</p>
          <p>Aucun logement trouvé. Modifiez les filtres.</p>
        </div>
      )}
    </div>
  )
}