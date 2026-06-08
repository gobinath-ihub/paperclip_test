import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { HeaderWrapper } from './components/Layout/HeaderWrapper'
import { Footer } from './components/Layout/Footer'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Cart } from './components/Cart'
import { Checkout } from './components/Checkout'
import { CartProvider } from './context/CartContext'
import axios from 'axios'

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:3000'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const handleLogout = () => {
    setToken(null)
  }

  return (
    <Router>
      <CartProvider token={token}>
        <div className="app-wrapper">
          <HeaderWrapper token={token} onLogout={handleLogout} />
          
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog token={token} />} />
              <Route path="/product/:id" element={<ProductDetail token={token} />} />
              <Route path="/login" element={
                token ? <Navigate to="/" /> : <Login onLogin={setToken} />
              } />
              <Route path="/register" element={
                token ? <Navigate to="/" /> : <Register onRegister={() => {}} />
              } />
              <Route path="/cart" element={
                token ? <Cart token={token} /> : <Navigate to="/login" />
              } />
              <Route path="/checkout" element={
                token ? <Checkout token={token} /> : <Navigate to="/login" />
              } />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
