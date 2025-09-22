import React from 'react'
import '../styles/category.css'
import { useState } from 'react';

export default function Categorytab({ categories, onSelect }) {

    const [active, setActive] = useState("all");

    const handleClick = (category) => {
        setActive(category);
        onSelect(category);
    };

    return (
        <div className="tabs">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`tab-btn ${active === cat ? "active" : ""}`}
                    onClick={() => handleClick(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}
