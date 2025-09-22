import React, { useState } from 'react';
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const changeEmail = (e) => setEmail(e.target.value);
    const changePass = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Login successful");
                console.log("Login Response:", data);

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                alert(data.error || "Login unsuccessful");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    onChange={changeEmail}
                    value={email}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={changePass}
                    value={password}
                    required
                />

                <button type="submit">Login</button>

                <p style={{ color: "black" }}>
                    Don’t have an account? <Link to="/signup">Signup</Link>
                </p>
            </form>
        </div>
    );
}
