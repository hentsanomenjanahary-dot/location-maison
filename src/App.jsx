import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Accueil from './pages/Accueil'
import Login from './pages/Login'
import DetailMaison from './pages/DetailMaison'
import Reservation from './pages/Reservation'
import Paiement from './pages/Paiement'
import Confirmation from './pages/Confirmation'
import MesReservations from './pages/MesReservations'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                 element={<Accueil />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/maison/:id"       element={<DetailMaison />} />
          <Route path="/reserver/:id"     element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
          <Route path="/paiement"         element={<ProtectedRoute><Paiement /></ProtectedRoute>} />
          <Route path="/confirmation"     element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
          <Route path="/mes-reservations" element={<ProtectedRoute><MesReservations /></ProtectedRoute>} />
          <Route path="/admin"            element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}