import './App.css'
import Navbar from './components/Navbar'
import Slider from './components/Slider'
import Products from './components/products'
import Sidebar from './components/Sidebar'
import Checkout from './components/Checkout'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([])

  const removeFromCart = (productName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== productName));
  };

  return (
    <>
      <Router>

        <Routes>
          <Route path='/' element={
            <>
              <Navbar products={products} onOpenSidebar={() => setIsSidebarOpen(true)} />
              <Slider />
              <Products products={products} setProducts={setProducts} cart={cart} setCart={setCart} />
              <Sidebar removeFromCart={removeFromCart} cart={cart} setCart={setCart} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            </>
          }>

          </Route>
          <Route path='/checkout' element={<Checkout cart={cart} />}></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
