export default function FiltreMaisons({ filtres, onChange }) {
  const villes = ['Antananarivo', 'Toamasina', 'Nosy Be', 'Mahajanga', 'Fianarantsoa']

  return (
    <div style={{
      background: '#1a1d27',
      border: '0.5px solid #2d3148',
      borderRadius: '12px',
      padding: '1.2rem',
      marginBottom: '1.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px'
    }}>
      <div>
        <label style={{ fontSize:'0.82rem', color:'#64748b', display:'block', marginBottom:'6px' }}>Ville</label>
        <select value={filtres.ville} onChange={e => onChange({ ...filtres, ville: e.target.value })}>
          <option value="">Toutes les villes</option>
          {villes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:'0.82rem', color:'#64748b', display:'block', marginBottom:'6px' }}>Prix max / nuit (€)</label>
        <input
          type="number"
          placeholder="Sans limite"
          value={filtres.prixMax}
          onChange={e => onChange({ ...filtres, prixMax: e.target.value })}
        />
      </div>
      <div>
        <label style={{ fontSize:'0.82rem', color:'#64748b', display:'block', marginBottom:'6px' }}>Chambres min.</label>
        <select value={filtres.chambres} onChange={e => onChange({ ...filtres, chambres: e.target.value })}>
          <option value="">Toutes</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize:'0.82rem', color:'#64748b', display:'block', marginBottom:'6px' }}>Personnes min.</label>
        <select value={filtres.personnes} onChange={e => onChange({ ...filtres, personnes: e.target.value })}>
          <option value="">Tous</option>
          <option value="2">2+</option>
          <option value="4">4+</option>
          <option value="6">6+</option>
        </select>
      </div>
    </div>
  )
}