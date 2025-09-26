import React, { useState } from 'react';
import '../styles/checkout.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext'
import Swal from 'sweetalert2';

export default function Checkout() {
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




    const { cart, setCart } = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const [moreInfo, setMoreInfo] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {

        const { fullName, email, address, city, postalCode, paymentMethod } = formData;


        if (!fullName || !email || !address || !city || !postalCode) {
            Swal.fire({
                title: "Fill your information please",
                icon: "error",
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
                showClass: {
                    popup: 'swal2-show'
                },
                hideClass: {
                    popup: 'swal2-hide'
                }
            });
            return;
        }

        if (formData.paymentMethod === '') {
            alert('Please select an option');
        } else if (formData.paymentMethod === 'cod') {
            Swal.fire({
                title: "🎉 Order Placed!",
                text: "Thank you for your purchase. Your order is on the way!",
                icon: "success",
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#f0f9ff",
                color: "#0f5132",
                position: "center",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                }
            });
        } else if (formData.paymentMethod === 'credit') {

        }

    };


    const updateQuantity = async (item, newQty) => {
        if (newQty < 1) return;


        try {
            await axios.put("http://localhost:5000/cart/update", {
                productId: item.product_id,
                quantity: newQty
            }, { withCredentials: true });


            setCart(prevCart =>
                prevCart.map(p =>
                    p.product_id === item.product_id
                        ? { ...p, quantity: newQty }
                        : p
                )
            );
        } catch (err) {
            console.log("Error updating quantity", err);
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
                        {formData.paymentMethod === 'credit' && (
                            <div className="credit-card-fields">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Card Number"
                                    value={formData.cardNumber || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="expiryDate"
                                    placeholder="Expiry Date (MM/YY)"
                                    value={formData.expiryDate || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="CVV"
                                    value={formData.cvv || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="cardHolder"
                                    placeholder="Card Holder Name"
                                    value={formData.cardHolder || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}


                        <h2>Payment Method</h2>
                        <div className="payment-options">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleChange}
                                />
                                Cash on Delivery
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="credit"
                                    checked={formData.paymentMethod === 'credit'}
                                    onChange={handleChange}
                                />
                                Credit Card
                            </label>
                        </div>



                    </div>


                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        {cart.map((item, index) => (
                            <div className="checkout-item" key={index}>
                                <img src={item.image_url} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item, item.quantity - 1)}
                                        >
                                            −
                                        </button>

                                        <span className="qty-number">{item.quantity}</span>

                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item, item.quantity + 1)}
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
