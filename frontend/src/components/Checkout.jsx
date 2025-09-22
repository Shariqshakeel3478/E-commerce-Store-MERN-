import React from 'react';
import '../styles/checkout.css';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cart }) {
    const navigate = useNavigate();

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty. Add some products first!</p>
            ) : (
                <>
                    <div className="checkout-items">
                        {cart.map((item, index) => (
                            <div className="checkout-item" key={index}>
                                <img src={item.image} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-summary">
                        <h2>Total: ${totalPrice.toFixed(2)}</h2>
                        <button className="place-order-btn" onClick={() => alert('Order Placed!')}>
                            Place Order
                        </button>
                        <button className="back-home-btn" onClick={() => navigate('/')}>
                            Back to Home
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
