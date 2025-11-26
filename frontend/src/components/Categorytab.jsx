
import React, { useState } from 'react';
import '../styles/category.css';

export default function Categorytab({
    categories,
    subcategories,
    onCategorySelect,
    onSubcategorySelect,
    products
}) {
    const [activeCategoryId, setActiveCategoryId] = useState("all");

    const handleCategoryClick = (cat) => {

        const selectedCategory = cat;
        setActiveCategoryId(selectedCategory.category_id)
        const result = products.filter(res => res.category_id === selectedCategory.category_id)
        console.log(result)
        console.log(activeCategoryId)
    };



    return (
        <div className="tabs">
            <div className="tab-buttons">
                <button
                    className={`tab-btn ${activeCategoryId === "all" ? "active" : ""}`}
                    onClick={() => {
                        setActiveCategoryId("all");
                        onCategorySelect(null);
                        onSubcategorySelect(null);
                    }}
                >
                    All
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.category_id}
                        className={`tab-btn ${activeCategoryId === cat.category_id ? "active" : ""}`}
                        onClick={() => handleCategoryClick(cat)}
                    >
                        {cat.category_name}
                    </button>
                ))}
            </div>

            {activeCategoryId !== "all" && (
                <div className="subtabs">
                    {subcategories
                        .filter((sub) => sub.category_id === activeCategoryId)
                        .map((sub) => (
                            <button
                                key={sub.subcategory_id}
                                className="sub-tab-btn"
                                onClick={() => onSubcategorySelect(sub)}
                            >
                                {sub.subcategory_name}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );



}
