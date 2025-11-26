import React from "react";
import "../styles/about.css";

export default function About() {
    return (
        <section className="about">
            <div className="about-container">

                {/* LEFT TEXT SECTION */}
                <div className="about-text">
                    <h2 className="about-heading">Who We Are</h2>
                    <p className="about-description">
                        At <strong>ShopEase</strong>, we make online shopping simple,
                        enjoyable, and reliable. Our mission is to deliver premium quality
                        products with a seamless shopping experience and outstanding support.
                    </p>

                    <div className="about-stats">
                        <div className="stat">
                            <h3>500+</h3>
                            <p>Products</p>
                        </div>

                        <div className="stat">
                            <h3>10k+</h3>
                            <p>Happy Customers</p>
                        </div>

                        <div className="stat">
                            <h3>5+</h3>
                            <p>Years of Trust</p>
                        </div>
                    </div>

                    <button className="about-btn">Learn More</button>
                </div>

                {/* RIGHT IMAGE SECTION */}
                <div className="about-image">
                    <img
                        src="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg"
                        alt="About our store"
                    />
                </div>

            </div>
        </section>
    );
}
