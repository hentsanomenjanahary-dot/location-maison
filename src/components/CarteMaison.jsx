import { Link } from 'react-router-dom'

export default function CarteMaison({ maison }) {
  return (
    <Link to={`/maison/${maison.id}`}>
      <div className="card" style={{ transition: 'border-color .2s, transform .2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='#7c3aed'; e.currentTarget.style.transform='translateY(-3px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='#2d3148'; e.currentTarget.style.transform='translateY(0)' }}
      >
        <img
          src={maison.image_url}
          alt={maison.titre}
          style={{ width:'100%', height:'180px', objectFit:'cover', display:'block' }}
          onError={e => { e.target.src = 'https://placehold.co/600x400/1a1d27/64748b?text=Maison' }}
        />
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin:'0 0 4px', fontSize:'1rem', color:'#e2e8f0' }}>{maison.titre}</h3>
          <p style={{ margin:'0 0 10px', fontSize:'0.85rem', color:'#64748b' }}>📍 {maison.ville}</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, color:'#a78bfa', fontSize:'1.05rem' }}>
              {maison.prix_par_nuit}€ <span style={{ fontWeight:400, color:'#64748b', fontSize:'0.8rem' }}>/nuit</span>
            </span>
            <div style={{ display:'flex', gap:'6px', alignItems:'center', fontSize:'0.8rem', color:'#64748b' }}>
              <span>🛏 {maison.nb_chambres}</span>
              <span>· 👥 {maison.nb_personnes}</span>
            </div>
          </div>
          <div style={{ marginTop:'10px' }}>
            <span className={`badge ${maison.disponible ? 'badge-green' : 'badge-red'}`}>
              {maison.disponible ? 'Disponible' : 'Indisponible'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}