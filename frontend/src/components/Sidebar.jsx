import React, { useEffect, useState } from 'react';
import '../styles/sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity } = useCart();


    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Your Cart ({cart.length})</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="cart-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button
                                className="continue-shopping"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="cart-list">
                            {cart.map((item) => (
                                <li className="cart-item" key={`${item.product_id}-${item.size || 'default'}`}>
                                    <img
                                        src={item.image ? `http://localhost:5000${item.image}` : '/default-image.jpg'}
                                        alt={item.name}
                                        className="cart-img"
                                        onError={(e) => {
                                            e.target.src = '/default-image.jpg';
                                        }}
                                    />
                                    <div className="cart-info">
                                        <h4>{item.name}</h4>
                                        <p>Rs {item.price} × {item.quantity}</p>
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                                className="qty-btn"
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                                className="qty-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.product_id)}
                                        aria-label="Remove item"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-section">
                            <h3>Total: Rs {total.toFixed(2)}</h3>
                            <p className="shipping-note">Free shipping on orders over $50</p>
                        </div>
                        <button
                            className="checkout-btn"
                            onClick={() => {
                                onClose();
                                navigate('/checkout');
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}