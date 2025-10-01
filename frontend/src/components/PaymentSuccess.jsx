import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useOrder } from "../context/OrderContext";
import Swal from 'sweetalert2';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const { orderData } = useOrder();

    const storedOrder = localStorage.getItem("orderData");
    const finalOrderData = storedOrder ? JSON.parse(storedOrder) : null;

    useEffect(() => {
        Swal.fire({
            title: "Payment Successful!",
            text: "Thank you for your purchase.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });

        console.log("Final order data sending to backend:", finalOrderData);

        if (finalOrderData) {
            axios.post("http://localhost:5000/orders", finalOrderData, {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    console.log("Order saved successfully:", res.data);
                    localStorage.removeItem("orderData");
                })
                .catch(err => {
                    console.error("Error saving order:", err.response?.data || err.message);
                });
        }

        setTimeout(() => {
            navigate("/");
        }, 2000);
    }, [navigate, finalOrderData]); // ✅ now valid

    if (!finalOrderData) return <p>No order found</p>;

    return (
        <div>
            <h1>Processing your order...</h1>
        </div>
    );
}


