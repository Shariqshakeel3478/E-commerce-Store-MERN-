import axios from 'axios'
import { useState, useEffect } from 'react'
import '../styles/products.css'
import Categorytab from './Categorytab'


export default function Products({ cart, setCart, products, setProducts }) {

    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [addedToCart, setAddedToCart] = useState(false)



    const addToCart = (product) => {
        setCart(prevCart => {

            const existing = prevCart.find(item => item.name === product.name);
            if (existing) {

                return prevCart.map(item =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {

                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    console.log(cart)

    useEffect(() => {

        axios.get("http://localhost:5000/products")
            .then((response) => {
                setProducts(response.data)
                setLoading(false)

            })
            .catch((error) => {
                setLoading(false)
            })
    }, [])

    if (loading) return <p>Loading products...</p>;
    console.log(products)

    console.log(cart)

    return (


        <div className='products'>
            <div className='product-filter'>
                <Categorytab
                    categories={["all", "mobile", "tablet", "earbuds", 'laptop']}
                    onSelect={(category) => setSelectedCategory(category)}
                />
            </div>

            <div className='product-cards'>

                {
                    products.filter((product) => {
                        return selectedCategory === "all"
                            ? true
                            : product.category === selectedCategory;
                    })
                        .map((product) => {
                            const cartItem = cart.find(item => item.name === product.name);

                            return (
                                <div className="card" key={product.id}>
                                    <img
                                        src={product.image_url}
                                        alt="Product"
                                        className="card-img"
                                    />
                                    <h3 className="card-title">{product.name}</h3>
                                    <p className="card-price">{product.price}$</p>

                                    {cartItem ? (
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => {
                                                    setCart(prevCart =>
                                                        prevCart.map(item =>
                                                            item.name === product.name
                                                                ? {
                                                                    ...item,
                                                                    quantity: item.quantity > 1 ? item.quantity - 1 : 1
                                                                }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                className="qty-btn"
                                            >−</button>

                                            <span className="qty-number">{cartItem.quantity}</span>

                                            <button
                                                onClick={() => {
                                                    setCart(prevCart =>
                                                        prevCart.map(item =>
                                                            item.name === product.name
                                                                ? { ...item, quantity: item.quantity + 1 }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                className="qty-btn"
                                            >+</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                const token = localStorage.getItem('token');
                                                if (token) {
                                                    addToCart({
                                                        name: product.name,
                                                        price: product.price,
                                                        image: product.image_url
                                                    });
                                                } else {
                                                    alert('Please Login First');
                                                }
                                            }}
                                            className="card-btn"
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            );
                        })

                }



            </div>
        </div >
    )
}
