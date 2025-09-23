import '../styles/navbar.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ onOpenSidebar, products, setCart }) {


    const [searchterm, setSearchTerm] = useState('')
    const [searchItems, setSearchItems] = useState([])
    const [showResults, setShowResults] = useState(false);
    console.log("products :", searchItems)

    const token = localStorage.getItem('token')

    const logout = () => {
        localStorage.removeItem('token');
        setCart([])
    }


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
                        {!token ? (
                            <button>
                                <i className="fa-solid fa-circle-user"></i>
                                <Link style={{ color: "white", textDecoration: "none" }} to="/login">Login</Link>
                            </button>
                        ) : (
                            <button onClick={logout}>
                                <i className="fa-solid fa-circle-user"></i>
                                Logout
                            </button>
                        )}
                        <button onClick={onOpenSidebar}>
                            <i className="fa-solid fa-bag-shopping"></i> View Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom menu (full width) */}
            <div className="nav-bottom">
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
