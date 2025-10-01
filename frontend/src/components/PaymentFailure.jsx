import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function PaymentFailure() {
    const navigate = useNavigate();

    React.useEffect(() => {
        Swal.fire({
            title: "❌ Payment Failed!",
            text: "Something went wrong, please try again.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false
        });

        setTimeout(() => {
            navigate("/checkout");
        }, 2000);
    }, [navigate]);

    return <p>Redirecting to checkout...</p>;
}
