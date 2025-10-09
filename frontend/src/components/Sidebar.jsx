import React from 'react'
import '../styles/sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import { useCart } from './CartContext'

export default function Sidebar({ isOpen, onClose }) {

    const navigate = useNavigate();
    const { cart, setCart } = useCart();


    useEffect(() => {
        axios
            .get("http://localhost:5000/cart", { withCredentials: true })
            .then((res) => {
                console.log("my cart", res.data);
                setCart(res.data);
            })
            .catch((err) => {
                console.log("Error fetching cart:", err);
            });
    }, [])

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/cart/remove/${productId}`, {
                withCredentials: true
            });


            setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
        } catch (err) {
            console.log("Error removing item:", err);
        }
    };




    return (
        <div className='sidebar'
            style={{ right: isOpen ? "0" : "-350px" }}
        >
            <h2>Your Cart</h2>
            <button onClick={onClose}>Close</button>
            <ul>

                {cart.map((item, index) => (
                    <li className='cart-item' key={index}>
                        <img
                            src={
                                (() => {
                                    const img = item.images;


                                    if (Array.isArray(img)) {
                                        return `http://localhost:5000${img[0]}`;
                                    }


                                    if (typeof img === "string" && img.startsWith("[")) {
                                        try {
                                            const parsed = JSON.parse(img);
                                            return `http://localhost:5000${parsed[0]}`;
                                        } catch (err) {
                                            console.error("JSON parse failed:", err);
                                        }
                                    }


                                    if (typeof img === "string") {
                                        return `http://localhost:5000${img}`;
                                    }


                                    return "placeholder.jpg";
                                })()
                            }
                            alt={item.name}
                            className="cart-img"
                        />

                        {item.name} x {item.quantity} - ${item.price * item.quantity} <button onClick={() => removeFromCart(item.product_id)}>X</button>
                    </li>
                ))}

                {cart.length === 0 ? <p>Add your favourite products</p> : <button onClick={() => navigate('/checkout')} className='checkout-btn'>Checkout</button>}
            </ul>

        </div>
    )
}
