import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/products.css";
import Categorytab from "./Categorytab";
import Swal from "sweetalert2";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

export default function Products({ products, setProducts, categories, subcategories, loading, setLoading }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [message, setMessage] = useState("");
    const { cart, setCart, addToCart } = useCart();

    const navigate = useNavigate()
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);


    const [likedItems, setLikedItems] = useState([]);

    const productOpen = (product_id) => {
        navigate(`/products/${product_id}`)

    }

    const toggleLike = (productId) => {
        setLikedItems((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };




    if (loading) return <p>Loading products...</p>;

    return (
        <div className="products">
            <div className="product-filter">
                <Categorytab
                    products={products}
                    categories={categories}
                    subcategories={subcategories}
                    onCategorySelect={(cat) => {
                        if (!cat) setSelectedCategory("all");
                        else setSelectedCategory(cat.category_id);
                    }}
                    onSubcategorySelect={(sub) => {
                        if (!sub) setSelectedSubcategory(null);
                        else setSelectedSubcategory(sub.subcategory_id);
                    }}
                />
            </div>

            <div className="product-cards">
                {products.map((product) => {
                    const isAdded = cart.some(
                        (item) => item.product_id === product.product_id
                    );
                    const isLiked = likedItems.includes(product.product_id);

                    return (
                        <div className="card" data-badge={product.badge} key={product.product_id}>
                            <img onClick={() => productOpen(product.product_id)}
                                src={
                                    (() => {
                                        const img = product.images;
                                        const filtered = img.find((img) => img.is_thumbnail === 1);
                                        return filtered
                                            ? `http://localhost:5000${filtered.image_path}`
                                            : "/default-image.jpg";
                                    })()
                                }
                                alt={product.name}
                                className="card-img"
                            />
                            <div className="product-des">
                                <h3 className="card-title">{product.name}</h3>
                                <div className="product-rating">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star-half-stroke"></i>
                                </div>
                            </div>

                            <div className="product-bottom">
                                <p className="card-price">Rs {product.price}</p>

                                <div className="product-buttons">
                                    <button
                                        className="card-btn"
                                        onClick={() => toggleLike(product.product_id)}
                                    >
                                        {isLiked ? (
                                            <i className="fa-solid fa-heart liked"></i>
                                        ) : (
                                            <i className="fa-regular fa-heart"></i>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => addToCart(product)}
                                        className={`card-btn ${isAdded ? "added" : ""}`}
                                        disabled={isAdded}
                                    >
                                        {isAdded ? <i className="fa-solid fa-check"></i> : (
                                            <i className="fa-solid fa-cart-shopping"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
