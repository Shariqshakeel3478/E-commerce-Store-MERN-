import React, { useState, useEffect } from "react";
import "../styles/slider.css";

const images = [
    "https://t3.ftcdn.net/jpg/04/65/46/52/360_F_465465254_1pN9MGrA831idD6zIBL7q8rnZZpUCQTy.jpg",
    "https://plus.unsplash.com/premium_photo-1661658740167-45b56833412b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
export default function Slider() {
    const [current, setCurrent] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval);
    }, [current]);

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="slider">
            <button className="prev" onClick={prevSlide}>
                ❮
            </button>
            <div className="slider-wrapper">
                {images.map((img, index) => (
                    <div
                        className={`slide ${index === current ? "active" : ""}`}
                        key={index}
                    >
                        <img src={img} alt={`slide-${index}`} />
                    </div>
                ))}
            </div>
            <button className="next" onClick={nextSlide}>

                ❯
            </button>
        </div>
    );
}
