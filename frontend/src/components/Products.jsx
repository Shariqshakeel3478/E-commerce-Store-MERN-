import axios from 'axios'
import { useState, useEffect } from 'react'
import '../styles/products.css'
import Categorytab from './Categorytab'
import Swal from 'sweetalert2';
import { useCart } from './CartContext';

export default function Products({ products, setProducts }) {
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [message, setMessage] = useState("");
    const { cart, setCart } = useCart();

    const addToCart = async (product) => {
        try {
            const authRes = await fetch("http://localhost:5000/check-auth", {
                method: "GET",
                credentials: "include"
            });

            const authData = await authRes.json();

            if (!authData.loggedIn) {
                Swal.fire({
                    title: 'Please login first',
                    icon: 'error',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                });
                return;
            }

            // Agar cart me already hai to dobara add na ho
            const alreadyInCart = cart.some((item) => item.product_id === product.id);
            if (alreadyInCart) return;

            const res = await fetch("http://localhost:5000/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: product.id })
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    title: "Item added to cart",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });

                setCart((prevCart) => [
                    ...prevCart,
                    { ...product, product_id: product.id, quantity: 1 }
                ]);
            } else {
                setMessage(data.message || "Failed to add item");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Something went wrong");
        }
    };

    useEffect(() => {
        axios.get("http://localhost:5000/products")
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading products...</p>;

    return (
        <div className='products'>
            <div className='product-filter'>
                <Categorytab
                    categories={["all", "mobile", "tablet", "earbuds", "laptop"]}
                    onSelect={(category) => setSelectedCategory(category)}
                />
            </div>

            <div className='product-cards'>
                {products.map((product) => {
                    // yahan check karo ke cart me already hai ya nahi
                    const isAdded = cart.some((item) => item.product_id === product.id);

                    return (
                        <div className="card" key={product.id}>
                            <img
                                src={product.image_url}
                                alt="Product"
                                className="card-img"
                            />
                            <h3 className="card-title">{product.name}</h3>
                            <p className="card-price">{product.price}$</p>

                            <button
                                onClick={() => addToCart(product)}
                                className={`card-btn ${isAdded ? "added" : ""}`}
                                disabled={isAdded}
                            >
                                {isAdded ? "✔ Added" : "Add to Cart"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
