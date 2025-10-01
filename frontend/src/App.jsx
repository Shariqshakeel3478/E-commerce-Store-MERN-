import './App.css'
import Navbar from './components/Navbar'
import Slider from './components/Slider'
import Products from './components/Products'
import Sidebar from './components/Sidebar'
import Checkout from './components/Checkout'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import About from './components/About'
import axios from 'axios'
import { CartProvider } from './components/CartContext'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { OrderProvider } from "./context/OrderContext";
import PaymentSuccess from './components/PaymentSuccess'
import PaymentFailure from './components/PaymentFailure'







function App() {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([])
  const [clicked, setClicked] = useState(false)









  return (
    <>
      <AuthProvider>

        <CartProvider>
          <OrderProvider>


            <Router>

              <Routes>
                <Route path='/' element={
                  <>
                    <Navbar products={products} onOpenSidebar={() => setIsSidebarOpen(true)} />
                    <Slider />
                    <About />
                    <Products clicked={clicked} setClicked={setClicked} products={products} setProducts={setProducts} />
                    <Sidebar clicked={clicked} setClicked={setClicked} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    <Footer />

                  </>
                }>

                </Route>

                <Route path='/checkout' element={<Checkout />}></Route>
                <Route path='/payment-success' element={<PaymentSuccess />}></Route>
                <Route path='/payment-failure' element={<PaymentFailure />}></Route>

                <Route path='/Login' element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }></Route>
                <Route path='/signup' element={<PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>}></Route>

              </Routes>
            </Router>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
