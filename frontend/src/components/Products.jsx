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
    const [categories, setCategories] = useState([])
    const [subcategories, setSubCategories] = useState([])
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);


    useEffect(() => {
        const fetchSubcategories = async () => {

            try {
                const res = await axios.get('http://localhost:5000/subcategories')
                setSubCategories(res.data);
            } catch (error) {
                console.error('Failed to fetch subcategories', error);
            }
        };
        fetchSubcategories();
    }, []);


    // categories
    useEffect(() => {

        const getCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/categories')

                setCategories(res.data)

            }
            catch (err) {
                console.log('cannot fetch categories')
            }
        }
        getCategories()

    }, [])


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
                console.log(response.data)
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
                    categories={categories}
                    subcategories={subcategories}
                    onCategorySelect={(cat) => {
                        if (!cat) {
                            setSelectedCategory("all");
                        } else {
                            setSelectedCategory(cat.category_id);
                        }
                    }}
                    onSubcategorySelect={(sub) => {
                        if (!sub) {
                            setSelectedSubcategory(null);
                        } else {
                            setSelectedSubcategory(sub.subcategory_id);
                        }
                    }}
                />


            </div>

            <div className='product-cards'>
                {products.map((product) => {


                    const isAdded = cart.some((item) => item.product_id === product.id);

                    return (
                        <div className="card" key={product.id}>
                            <img
                                src={
                                    (() => {
                                        const img = product.images;

                                        // Agar array ke form me hai (already parsed from backend)
                                        if (Array.isArray(img)) {
                                            return `http://localhost:5000${img[0]}`;
                                        }

                                        // Agar JSON stringified array hai
                                        if (typeof img === "string" && img.startsWith("[")) {
                                            try {
                                                const parsed = JSON.parse(img);
                                                return `http://localhost:5000${parsed[0]}`;
                                            } catch (err) {
                                                console.error("JSON parse failed:", err);
                                            }
                                        }

                                        // Agar simple string path hai ("/uploads/products/xyz.jpg")
                                        if (typeof img === "string") {
                                            return `http://localhost:5000${img}`;
                                        }

                                        // Default placeholder
                                        return "placeholder.jpg";
                                    })()
                                }
                                alt={product.name}
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
