import '../styles/navbar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function Navbar({ onOpenSidebar, products, logout, isAuthenticated }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchItems, setSearchItems] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const { cart } = useCart();

    const changeSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value === '') {
            setSearchItems([]);
        } else {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            );
            setSearchItems(filtered);
        }
    };

    return (
        <>
            {/* TOP INFO BAR */}
            <div className="top-bar">
                <div className="left-info">
                    <p><i className="fa-solid fa-location-dot"></i> 123 Main Street, Anywhere USA</p>
                    <p><i className="fa-solid fa-phone"></i> +1 (555) 123-4567</p>
                </div>
                <div className="right-info">
                    <select>
                        <option>USD</option>
                        <option>PKR</option>
                    </select>
                    <select>
                        <option>English</option>
                        <option>Urdu</option>
                    </select>
                </div>
            </div>

            {/* MAIN NAVBAR */}
            <div className='navbar'>
                <div className='nav-left'>
                    <div className='logo'>
                        e<span>-Shop</span>
                    </div>
                </div>

                <div className='nav-center'>
                    <div className='search'>
                        <input
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            onChange={changeSearch}
                            type="text"
                            placeholder='Search products, brands...'
                            value={searchTerm}
                        />
                        <button>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        {showResults && (
                            <div className='search-results'>
                                <ul>
                                    {searchItems.length === 0
                                        ? <li>No results found</li>
                                        : searchItems.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className='nav-right'>
                    {!isAuthenticated ? (
                        <Link to="/login">
                            <button className='nav-btn'>
                                <i className="fa-solid fa-user"></i> Login
                            </button>
                        </Link>
                    ) : (
                        <button className='nav-btn' onClick={logout}>
                            <i className="fa-solid fa-user"></i> Logout
                        </button>
                    )}

                    <button className="cart-container" onClick={onOpenSidebar}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        {cart.length > 0 && <div className="cart-count">{cart.length}</div>}
                    </button>
                </div>
            </div>

            {/* NAV LINKS BAR */}
            <div className="nav-bottom">
                <ul>
                    <li>All Categories</li>
                    <li>Products</li>
                    <li>Blog</li>
                    <li>Contact</li>
                    <li className="highlight">LIMITED SALE</li>
                    <li>Best Seller</li>
                    <li>New Arrival</li>
                </ul>
            </div>
        </>
    );
}
