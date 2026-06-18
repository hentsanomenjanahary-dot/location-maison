// import { useLocation, Link } from 'react-router-dom'

// export default function Confirmation() {
//   const { state } = useLocation()
//   if (!state) return <Link to="/">Retour à l'accueil</Link>
//   const { maisonTitre, nbNuits, prixTotal, dateDebut, dateFin } = state

//   return (
//     <div className="page" style={{ maxWidth:'520px', textAlign:'center' }}>
//       <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🎉</div>
//       <h1 style={{ color:'#4ade80', marginBottom:'0.5rem' }}>Réservation confirmée !</h1>
//       <p style={{ color:'#64748b', marginBottom:'2rem' }}>Votre paiement a été accepté avec succès.</p>
//       <div className="card" style={{ padding:'1.5rem', textAlign:'left', marginBottom:'2rem' }}>
//         <h3 style={{ color:'#a78bfa', marginBottom:'1rem' }}>{maisonTitre}</h3>
//         <div style={{ display:'grid', gap:'8px', fontSize:'0.9rem', color:'#94a3b8' }}>
//           <div style={{ display:'flex', justifyContent:'space-between' }}>
//             <span>Arrivée</span><span style={{ color:'#e2e8f0' }}>{dateDebut}</span>
//           </div>
//           <div style={{ display:'flex', justifyContent:'space-between' }}>
//             <span>Départ</span><span style={{ color:'#e2e8f0' }}>{dateFin}</span>
//           </div>
//           <div style={{ display:'flex', justifyContent:'space-between' }}>
//             <span>Durée</span><span style={{ color:'#e2e8f0' }}>{nbNuits} nuit(s)</span>
//           </div>
//           <div style={{ display:'flex', justifyContent:'space-between', borderTop:'0.5px solid #2d3148', paddingTop:'8px', fontWeight:700 }}>
//             <span style={{ color:'#e2e8f0' }}>Total payé</span>
//             <span style={{ color:'#4ade80' }}>{prixTotal}€</span>
//           </div>
//         </div>
//       </div>
//       <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
//         <Link to="/mes-reservations">
//           <button className="btn-primary" style={{ width:'auto' }}>Mes réservations</button>
//         </Link>
//         <Link to="/">
//           <button className="btn-secondary">Accueil</button>
//         </Link>
//       </div>
//     </div>
//   )
// }

import { useLocation, Link } from 'react-router-dom'
import jsPDF from 'jspdf'

export default function Confirmation() {
  const { state } = useLocation()
  if (!state) return <Link to="/">Retour à l'accueil</Link>
  const { maisonTitre, nbNuits, prixTotal, dateDebut, dateFin } = state

  const telechargerFacture = () => {
    const doc = new jsPDF()

    // En-tête
    doc.setFillColor(26, 29, 39)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(167, 139, 250)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('MaisonMada', 20, 25)

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('Facture de réservation', 150, 25)

    // Numéro facture et date
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const dateFacture = new Date().toLocaleDateString('fr-FR')
    const numFacture = 'FAC-' + Date.now().toString().slice(-6)
    doc.text(`Numéro : ${numFacture}`, 20, 55)
    doc.text(`Date : ${dateFacture}`, 20, 63)

    // Ligne séparatrice
    doc.setDrawColor(124, 58, 237)
    doc.setLineWidth(0.5)
    doc.line(20, 70, 190, 70)

    // Détails réservation
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 29, 39)
    doc.text('Détails de la réservation', 20, 85)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    doc.text(`Logement : ${maisonTitre}`, 20, 100)
    doc.text(`Date d'arrivée : ${dateDebut}`, 20, 112)
    doc.text(`Date de départ : ${dateFin}`, 20, 124)
    doc.text(`Durée : ${nbNuits} nuit(s)`, 20, 136)

    // Ligne séparatrice
    doc.line(20, 145, 190, 145)

    // Total
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(124, 58, 237)
    doc.text(`Total payé : ${prixTotal} €`, 20, 160)

    // Statut paiement
    doc.setFillColor(5, 46, 22)
    doc.roundedRect(20, 170, 80, 12, 3, 3, 'F')
    doc.setTextColor(74, 222, 128)
    doc.setFontSize(10)
    doc.text('✓ Paiement confirmé', 25, 179)

    // Pied de page
    doc.setFillColor(26, 29, 39)
    doc.rect(0, 270, 210, 30, 'F')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('MaisonMada - Location de maisons à Madagascar', 20, 282)
    doc.text('Merci de votre confiance !', 20, 290)

    doc.save(`Facture-${numFacture}.pdf`)
  }

  return (
    <div className="page" style={{ maxWidth:'520px', textAlign:'center' }}>
      <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🎉</div>
      <h1 style={{ color:'#4ade80', marginBottom:'0.5rem' }}>Réservation confirmée !</h1>
      <p style={{ color:'#64748b', marginBottom:'2rem' }}>Votre paiement a été accepté avec succès.</p>

      <div className="card" style={{ padding:'1.5rem', textAlign:'left', marginBottom:'2rem' }}>
        <h3 style={{ color:'#a78bfa', marginBottom:'1rem' }}>{maisonTitre}</h3>
        <div style={{ display:'grid', gap:'8px', fontSize:'0.9rem', color:'#94a3b8' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>Arrivée</span><span style={{ color:'#e2e8f0' }}>{dateDebut}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>Départ</span><span style={{ color:'#e2e8f0' }}>{dateFin}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>Durée</span><span style={{ color:'#e2e8f0' }}>{nbNuits} nuit(s)</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', borderTop:'0.5px solid #2d3148', paddingTop:'8px', fontWeight:700 }}>
            <span style={{ color:'#e2e8f0' }}>Total payé</span>
            <span style={{ color:'#4ade80' }}>{prixTotal} €</span>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
        <button className="btn-primary" onClick={telechargerFacture} style={{ width:'auto', background:'#059669' }}>
          📄 Télécharger la facture PDF
        </button>
        <Link to="/mes-reservations">
          <button className="btn-primary" style={{ width:'auto' }}>Mes réservations</button>
        </Link>
        <Link to="/">
          <button className="btn-secondary">Accueil</button>
        </Link>
      </div>
    </div>
  )
}