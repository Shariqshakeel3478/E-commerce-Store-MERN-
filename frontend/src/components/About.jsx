import React from 'react'
import '../styles/about.css'

export default function About() {
    return (
        <section className="about-us">
            <div className="about-left">

                <img
                    src="https://uztech.pk/wp-content/uploads/2023/06/about-open-parcel.png"
                    alt="Team Illustration"
                    className="about-image"
                />
            </div>

            <div className="about-right">
                <h2>ABOUT US</h2>
                <p>
                    We’re a passionate team of creators, thinkers, and doers working together to bring ideas to life.
                    From concept to execution, we aim to deliver impactful solutions that make a difference.
                    Innovation drives us, and collaboration defines us.
                </p>
                <button className="learn-more-btn">Learn More</button>
            </div>
        </section>

    )
}
