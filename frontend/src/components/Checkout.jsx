import React, { useState } from 'react';
import '../styles/checkout.css';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cart, setCart }) {
    const navigate = useNavigate();
    const [paymentOption, setPaymentoption] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'cod'
    });

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {

        const { fullName, email, address, city, postalCode, paymentMethod } = formData;


        if (!fullName || !email || !address || !city || !postalCode) {
            alert("Please fill all billing details before placing the order.");
            return;
        }

        if (formData.paymentMethod === '') {
            alert('Please select an option');
        } else if (formData.paymentMethod === 'cod') {
            alert('Cash on Delivery');
        } else if (formData.paymentMethod === 'credit') {
            alert('Payment through Card');
        }

    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {cart.length === 0 ? (
                <div>
                    <p className="empty-cart">Your cart is empty. Add some products first!</p>
                    <button className="back-home-btn" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            ) : (
                <div className="checkout-content">
                    <div className="checkout-form">
                        <h2>Billing Information</h2>
                        <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} />
                        <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange} />
                        <input type="text" name="address" required placeholder="Address" value={formData.address} onChange={handleChange} />
                        <input type="text" name="city" required placeholder="City" value={formData.city} onChange={handleChange} />
                        <input type="text" name="postalCode" required placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />

                        <h2>Payment Method</h2>
                        <div className="payment-options">
                            <label>
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                                Cash on Delivery
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" value="credit" checked={formData.paymentMethod === 'credit'} onChange={handleChange} />
                                Credit Card
                            </label>

                        </div>
                    </div>


                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        {cart.map((item, index) => (
                            <div className="checkout-item" key={index}>
                                <img src={item.image} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => {
                                                setCart(prevCart =>
                                                    prevCart.map(p =>
                                                        p.name === item.name
                                                            ? { ...p, quantity: p.quantity > 1 ? p.quantity - 1 : 1 }
                                                            : p
                                                    )
                                                );
                                            }}
                                        >
                                            −
                                        </button>

                                        <span className="qty-number">{item.quantity}</span>

                                        <button
                                            className="qty-btn"
                                            onClick={() => {
                                                setCart(prevCart =>
                                                    prevCart.map(p =>
                                                        p.name === item.name
                                                            ? { ...p, quantity: p.quantity + 1 }
                                                            : p
                                                    )
                                                );
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p>Price: ${item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}

                        <h2>Total: ${totalPrice.toFixed(2)}</h2>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>
                            Place Order
                        </button>
                        <button className="back-home-btn" onClick={() => navigate('/')}>
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
