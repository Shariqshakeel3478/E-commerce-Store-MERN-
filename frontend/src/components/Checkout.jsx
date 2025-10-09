import React, { useState } from 'react';
import '../styles/checkout.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext'
import Swal from 'sweetalert2';
import { useOrder } from "../context/OrderContext";


export default function Checkout() {
    const { orderData, setOrderData } = useOrder();

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
            axios.post("http://localhost:5000/orders", {
                user: formData,
                paymentMethod: "cod",
                total: totalPrice,
                items: cart
            })
                .then(res => {
                    setOrderData({
                        user: formData,
                        paymentMethod: "cod",
                        total: totalPrice,
                        items: cart
                    });

                    Swal.fire({
                        title: "🎉 Order Placed!",
                        text: "Thank you for your purchase. Your order is on the way!",
                        icon: "success",
                        timer: 2500,
                        showConfirmButton: false,
                    });
                    setCart([]);
                    navigate("/");
                })
                .catch(err => {
                    console.error("Error saving order:", err);
                    Swal.fire("Error", "Failed to save order", "error");
                });
        } else if (formData.paymentMethod === 'credit') {

            axios.get("http://localhost:5000/get-token")
                .then(res => {
                    const orderObj = {
                        user: formData,
                        paymentMethod: "credit",
                        total: totalPrice,
                        items: cart
                    };

                    setOrderData(orderObj);
                    localStorage.setItem("orderData", JSON.stringify(orderObj));

                    const token = res.data.token;

                    const payload = {
                        MERCHANT_ID: "102",
                        MERCHANT_NAME: "Shariq",
                        TOKEN: token,
                        TXNAMT: Math.round(totalPrice).toString(),
                        CUSTOMER_MOBILE_NO: "923001234567",
                        CUSTOMER_EMAIL_ADDRESS: formData.email,
                        SUCCESS_URL: "http://localhost:5173/payment-success",
                        FAILURE_URL: "http://localhost:3000/payment-failure",
                        BASKET_ID: "order-" + Date.now(),
                        CURRENCY_CODE: "PKR",
                        ORDER_DATE: new Date().toISOString().split("T")[0],
                        CUSTOMER_NAME: formData.fullName
                    };

                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";

                    for (let key in payload) {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = payload[key];
                        form.appendChild(input);
                    }

                    document.body.appendChild(form);
                    form.submit();
                })
                .catch(err => {
                    console.error("Token fetch error:", err);
                    Swal.fire({
                        title: "Payment initialization failed",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false
                    });
                });

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
