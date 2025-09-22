import '../styles/navbar.css'
import { useState } from 'react'
export default function Navbar({ onOpenSidebar, products }) {


    const [searchterm, setSearchTerm] = useState('')
    const [searchItems, setSearchItems] = useState([])
    const [showResults, setShowResults] = useState(false);
    console.log("products :", searchItems)

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
            <div className='navbar' style={{ position: "relative" }}>
                <div className='nav-left'>
                    <div className='logo'>My Store</div>
                </div>
                <div className="nav-right">
                    <div className="nav-right-top">
                        <div className='search'>
                            <input onFocus={() => setShowResults(true)} onChange={changeSearch} type="text" placeholder='Find your product here' /><button><i className="fa-solid fa-magnifying-glass"></i></button>
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
                        <div className='nav-btns'>
                            <button><i className="fa-solid fa-circle-user"></i> Login</button>
                            <button onClick={onOpenSidebar}> <i className="fa-solid fa-bag-shopping"></i>View Cart</button>
                        </div>
                    </div>
                    <div className="nav-right-bottom">
                        <ul>
                            <li>Home</li>
                            <li>About</li>
                            <li>Categories</li>
                            <li>Products</li>
                        </ul>
                    </div>
                </div>
            </div >

        </>
    )
}
