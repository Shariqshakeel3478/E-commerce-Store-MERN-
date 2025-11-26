import React from "react";
import "../styles/footer.css";
import { useState } from "react";

export default function Footer() {

    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you for subscribing with: ${email}`);
        setEmail('');
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>We are a leading e-commerce platform offering the best products at competitive prices. Our mission is to provide exceptional shopping experiences.</p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Shop</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Customer Service</h3>
                    <ul className="footer-links">
                        <li><a href="#">Track Order</a></li>
                        <li><a href="#">Returns & Refunds</a></li>
                        <li><a href="#">Shipping Policy</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Newsletter</h3>
                    <p>Subscribe to our newsletter for the latest updates and offers.</p>
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                    <div className="payment-methods">
                        <p>We Accept:</p>
                        <div className="payment-icons">
                            <i className="fab fa-cc-visa"></i>
                            <i className="fab fa-cc-mastercard"></i>
                            <i className="fab fa-cc-paypal"></i>
                            <i className="fab fa-cc-apple-pay"></i>
                            <i className="fab fa-cc-amazon-pay"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2023 E-commerce Store. All rights reserved.</p>
            </div>
        </footer>
    );

}
