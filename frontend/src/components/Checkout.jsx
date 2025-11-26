import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useOrder } from '../context/OrderContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../styles/checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, setCart, updateQuantity } = useCart();
    const { setOrderData } = useOrder();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'cod'
    });

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        const { fullName, email, address, city, postalCode, paymentMethod } = formData;

        if (!fullName || !email || !address || !city || !postalCode) {
            Swal.fire({
                icon: 'error',
                title: 'Please fill all fields',
                timer: 1500,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
            return;
        }

        const orderObj = {
            user: formData,
            paymentMethod,
            total: totalPrice,
            items: cart
        };

        try {
            if (paymentMethod === 'cod') {
                await axios.post('http://localhost:5000/orders', orderObj);
                setOrderData(orderObj);
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    timer: 2000,
                    showConfirmButton: false
                });
                setCart([]);
                navigate('/');
            } else if (paymentMethod === 'credit') {
                // Implement credit card flow here
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to place order',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
                </div>
            ) : (
                <div className="checkout-content">
                    {/* Left Side: Billing Form */}
                    <div className="checkout-form">
                        <h2>Billing Information</h2>
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                        <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />

                        <h2>Payment Method</h2>
                        <div className="payment-options">
                            <div className='payment-option'>
                                <label>Cash on Delivery </label>
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />

                            </div>
                            <div className='payment-option'>
                                <label> Credit Card</label>
                                <input type="radio" name="paymentMethod" value="credit" checked={formData.paymentMethod === 'credit'} onChange={handleChange} />

                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        {cart.map((item, idx) => (
                            <div className="checkout-item" key={idx}>
                                <img src={item.image_url} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <div className="quantity-controls">
                                        <button className="qty-btn" onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
                                        <span className="qty-number">{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                                    </div>
                                    <p>Rs {item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                        <h2 className="total">Total: Rs {totalPrice.toFixed(2)}</h2>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                        <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
                    </div>
                </div>
            )}
        </div>
    );
}
