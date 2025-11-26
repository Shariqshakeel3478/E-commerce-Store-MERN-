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
import { CartProvider } from './components/CartContext'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import Swal from 'sweetalert2'
import { OrderProvider } from "./context/OrderContext";
import PaymentSuccess from './components/PaymentSuccess'
import PaymentFailure from './components/PaymentFailure'
import Admin from './admin/Admin'
import Testimonials from './components/Testimonials'
import axios from 'axios'
import ProductDetails from './components/ProductDetails'
import { useCart } from './components/CartContext'







function App() {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([])
  const [clicked, setClicked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  const [cart, setCart] = useState([]);


  useEffect(() => {
    axios
      .get("http://localhost:5000/cart", { withCredentials: true })
      .then((res) => {
        setCart(res.data)
        console.log("Cart API Response:", res);
      })
      .catch((err) => console.error("Failed to fetch cart:", err));
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/subcategories");
        setSubCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/categories");
        setCategories(res.data);
      } catch (err) {
        console.log("cannot fetch categories");
      }
    };
    getCategories();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      setIsAuthenticated(false);
      Swal.fire({
        title: "Loged out",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };



  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/check-auth", {
          credentials: "include"
        });
        const data = await res.json();
        setIsAuthenticated(data.loggedIn);
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };
    checkAuth();
  }, []);


  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);







  return (
    <>
      <AuthProvider>

        <CartProvider value={{ cart, setCart }}>
          <OrderProvider>


            <Router>

              <Routes>
                <Route path='/' element={
                  <>
                    <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} logout={logout} products={products} onOpenSidebar={() => setIsSidebarOpen(true)} />
                    <Slider />
                    <Products categories={categories} setCategories={setCategories} subcategories={subcategories} setSubCategories={setSubCategories} loading={loading} setLoading={setLoading} clicked={clicked} setClicked={setClicked} products={products} setProducts={setProducts} />
                    <About />
                    <Testimonials />
                    <Sidebar clicked={clicked} setClicked={setClicked} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    <Footer />

                  </>
                }>

                </Route>

                <Route path='/checkout' element={<Checkout />}></Route>
                <Route path='/payment-success' element={<PaymentSuccess />}></Route>
                <Route path='/payment-failure' element={<PaymentFailure />}></Route>
                <Route path='/admin' element={<Admin logout={logout} />}></Route>
                <Route path='/products/:productID' element={<ProductDetails />}></Route>


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
      </AuthProvider >
    </>
  )
}

export default App
