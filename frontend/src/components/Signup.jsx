import React, { useState } from 'react'
import '../styles/signUp.css'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();


    const changeName = (e) => {
        setUsername(e.target.value)
    }
    const changeEmail = (e) => {
        setEmail(e.target.value)
    }
    const changePass = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            })

            const data = await res.json();

            if (res.ok) {
                console.log("Signup Response:", data);
                navigate('/login')
                alert("Registered successfully")
            }
        }
        catch (err) {
            console.error("Error:", err);
        }
    }


    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Create Account</h2>

                <input type="text" value={username} onChange={changeName} placeholder="Username" required />
                <input type="email" placeholder="Email" value={email} onChange={changeEmail} required />
                <input type="password" placeholder="Password" value={password} onChange={changePass} required />

                <button type="submit">Sign Up</button>
                <p style={{ color: "black" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    )
}
