import React, { useState, useEffect } from "react";
import "../styles/slider.css";
import img1 from '../assets/images/pexels-thepaintedsquare-583842.jpg'

export default function Slider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Summer Collection 2025",
            description: "Discover the latest trends with premium outfits and unbeatable deals.",
            buttonText: "Shop Now",
            image: img1
        },
        {
            id: 2,
            title: "New Tech Gadgets",
            description: "Upgrade your tech life with the latest devices and accessories.",
            buttonText: "Explore Tech",
            image: img1
        },
        {
            id: 3,
            title: "Home & Living",
            description: "Give your home a fresh new look with our modern interior collection.",
            buttonText: "Discover Home",
            image: img1
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => setCurrentSlide(index);

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % slides.length);

    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="hero">
            <div className="slider">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentSlide ? "active" : ""}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slide-overlay"></div>

                        <div className="slide-content">
                            <h1>{slide.title}</h1>
                            <p>{slide.description}</p>
                            <a href="#" className="btn">{slide.buttonText}</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="slider-controls">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`slider-dot ${index === currentSlide ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                    ></div>
                ))}
            </div>

            <div className="slider-nav slider-prev" onClick={prevSlide}>
                <i className="fas fa-chevron-left"></i>
            </div>

            <div className="slider-nav slider-next" onClick={nextSlide}>
                <i className="fas fa-chevron-right"></i>
            </div>
        </section>
    );
}
