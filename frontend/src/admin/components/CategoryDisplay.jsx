import React, { useState } from 'react';
import './categoryDisplay.css';

export default function CategoryDisplay({ categories, subCategories }) {
  console.log(categories)
  console.log(subCategories)
  const [filtered, setFiltered] = useState([]);

  const categoryFilter = (id) => {
    const filteredArray = subCategories.filter(
      (item) => item.category_id === id
    );
    setFiltered(filteredArray);
  };

  return (
    <>
      <h1>Categories and their Subcategories</h1>

      <div className="cat-wrap">
        {/* Left — Categories */}
        <div className="cat-panel">
          <div className="cat-search">
            <input type="text" placeholder="Search categories..." />
          </div>

          <ul className="cat-list">
            {categories.map((cat) => (
              <li
                key={cat.category_id}
                className="cat-item"
                onClick={() => categoryFilter(cat.category_id)}
              >
                <div className="cat-left">
                  <span className="cat-name">{cat.category_name}</span>

                </div>
                <div className="cat-chev">›</div>
              </li>
            ))}
          </ul>
        </div>


        <div className="sub-panel">
          <div className="sub-header">
            <h3>Subcategories</h3>
            <button className="show-all-btn">View All</button>
          </div>

          <ul className="sub-list">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <li key={item.subcategory_id} className="sub-item">
                  <button className="sub-btn">
                    <span className="sub-name">{item.subcategory_name}</span>
                  </button>
                </li>
              ))
            ) : (
              <p className="no-sub">Select a category to view subcategories</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
