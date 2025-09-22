import React from 'react'
import '../styles/sidebar.css'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose, cart, removeFromCart }) {

    const navigate = useNavigate();



    return (
        <div className='sidebar'
            style={{ right: isOpen ? "0" : "-350px", }}
        >
            <h2>Your Cart</h2>
            <button onClick={onClose}>Close</button>
            <ul>

                {cart.map((item, index) => (
                    <li className='cart-item' key={index}>
                        <img src={item.image} alt="" />
                        {item.name} x {item.quantity} - ${item.price * item.quantity} <button onClick={() => removeFromCart(item.name)}>X</button>
                    </li>
                ))}

                {cart.length === 0 ? <p>Add your favourite products</p> : <button onClick={() => navigate('/checkout')} className='checkout-btn'>Checkout</button>}
            </ul>

        </div>
    )
}
