import '../styles/navbar.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCart } from './CartContext'

export default function Navbar({ onOpenSidebar, products }) {


    const [searchterm, setSearchTerm] = useState('')
    const [searchItems, setSearchItems] = useState([])
    const [showResults, setShowResults] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [totalItems, setTotalItems] = useState(3);

    const { cart, setCart } = useCart();
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



    const changeSearch = (e) => {

        let value = e.target.value;
        setSearchTerm(value)

        if (value === '') {
            setSearchItems([])
        }
        else {
            let filtered = products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
            setSearchItems(filtered)
        }
    }



    return (
        <>
            <div className='navbar'>
                {/* Left: Logo */}
                <div className='nav-left'>
                    <div className='logo'>My Store</div>
                </div>

                {/* Center: Search */}
                <div className='nav-center'>
                    <div className='search'>
                        <input
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setShowResults(false)}
                            onChange={changeSearch}
                            type="text"
                            placeholder='Find your product here'
                        />
                        <button>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        {showResults && (
                            <div className='search-results'>
                                <ul>
                                    {searchItems.length === 0
                                        ? <li>No items to display</li>
                                        : searchItems.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Buttons */}
                <div className='nav-right'>
                    <div className='nav-btns'>
                        {!isAuthenticated ? (
                            <Link style={{ color: "white", textDecoration: "none" }} to="/login"><button>
                                <i className="fa-solid fa-circle-user"></i>Login
                            </button></Link>

                        ) : (
                            <button onClick={logout}>
                                <i className="fa-solid fa-circle-user"></i>
                                Logout
                            </button>
                        )}
                        <div className="cart-container" onClick={onOpenSidebar}>
                            <div className="cart-icon">🛒</div>
                            {totalItems > 0 && <div className="cart-count">{cart.length}</div>}
                        </div>
                    </div>
                </div>
            </div >


            <div div className="nav-bottom" >
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Categories</li>
                    <li>Products</li>
                </ul>
            </div>
        </>



    )
}
