import React from "react";
import "./testimonials.css";

export default function Testimonials() {
    const testimonials = [
        {
            name: "Ayesha Khan",
            role: "UI/UX Designer",
            text: "Working with this team was a great experience! They delivered the project ahead of schedule with beautiful design and clean code.",
            image: "https://i.pravatar.cc/100?img=1",
            rating: 5,
        },
        {
            name: "Ali Raza",
            role: "Entrepreneur",
            text: "They turned my idea into a real product! Communication was smooth and the results exceeded my expectations.",
            image: "https://i.pravatar.cc/100?img=2",
            rating: 4,
        },
        {
            name: "Sara Ahmed",
            role: "Software Engineer",
            text: "Their attention to detail and commitment to quality really impressed me. I would definitely recommend them.",
            image: "https://i.pravatar.cc/100?img=3",
            rating: 5,
        },
    ];

    return (
        <section className="testimonials-section">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
                {testimonials.map((t, i) => (
                    <div className="testimonial-card" key={i}>
                        <div className="testimonial-image">
                            <img src={t.image} alt={t.name} />
                        </div>
                        <div className="stars">
                            {"★".repeat(t.rating)}
                            {"☆".repeat(5 - t.rating)}
                        </div>
                        <p className="testimonial-text">“{t.text}”</p>
                        <h3 className="testimonial-name">{t.name}</h3>
                        <span className="testimonial-role">{t.role}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
