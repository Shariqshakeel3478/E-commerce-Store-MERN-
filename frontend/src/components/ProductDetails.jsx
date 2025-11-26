import React, { useEffect, useState } from 'react'

import Navbar from './Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './productdetail.css'
import { useCart } from "./CartContext";

export default function ProductDetails() {
    const { productID } = useParams()
    const [productDetail, setProductDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mainImage, setMainImage] = useState("")
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const { cart, addToCart, removeFromCart } = useCart();


    const isProductInCart = cart.some(item => item.product_id === parseInt(productID));
    const navigate = useNavigate()

    useEffect(() => {
        const getSingleProduct = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`http://localhost:5000/products/${productID}`)

                if (res.status !== 200) {
                    throw new Error('Failed to fetch product')
                }

                setProductDetail(res.data)

                if (res.data.images && res.data.images.length > 0) {
                    setMainImage(`http://localhost:5000${res.data.images[0].image_path}`)
                }
            } catch (err) {
                console.error("Error fetching product:", err)
                setError('Product not found')
            } finally {
                setLoading(false)
            }
        }

        getSingleProduct()
    }, [productID])

    const handleImageClick = (img, index) => {
        setMainImage(`http://localhost:5000${img.image_path}`)
        setSelectedImage(index)
    }


    const handleAddToCart = () => {
        if (!productDetail) return;


        const productForCart = {
            product_id: productDetail.id,
            name: productDetail.name,
            price: productDetail.price,
            image: productDetail.images[0]?.image_path,
            quantity: quantity
        };

        addToCart(productForCart);
    }

    // Handle quantity increase
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    }

    // Handle quantity decrease
    const decreaseQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div>Loading product...</div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div>Error: {error}</div>
            </>
        )
    }

    return (
        <>
            <Navbar />

            <div className="navigate-btn">
                <button

                    onClick={() => navigate("/")}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <i className="fas fa-arrow-left"></i>
                    Back
                </button>
            </div>
            <div className='product-details'>
                <div className="product-left">
                    <div className="images-box">
                        <div className="main-image">
                            <img src={mainImage} alt={productDetail.name} />
                        </div>
                        <div className="rem-image">
                            {productDetail.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000${img.image_path}`}
                                    alt={`${productDetail.name} ${index + 1}`}
                                    className={selectedImage === index ? 'active' : ''}
                                    onClick={() => handleImageClick(img, index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="product-right">
                    <h2>{productDetail.name}</h2>
                    <p>{productDetail.description || "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi, architecto reiciendis odit similique ipsa ducimus ad distinctio doloribus. Molestias quisquam accusamus libero iusto, pariatur hic. Molestiae explicabo animi quis iure!"}</p>

                    <div className="price-section">
                        <h2>{productDetail.price} Rs</h2>
                    </div>

                    <div className="quantity-selector">
                        <label htmlFor="quantity">Quantity:</label>
                        <div className="quantity-controls">
                            <button
                                className="qty-btn"
                                onClick={decreaseQuantity}
                            >-</button>
                            <input
                                type="number"
                                id="quantity"
                                className="qty-input"
                                value={quantity}
                                min="1"
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            />
                            <button
                                className="qty-btn"
                                onClick={increaseQuantity}
                            >+</button>
                        </div>
                    </div>

                    {isProductInCart ? (
                        <button className="already-in-cart-btn" disabled>
                            Already in Cart
                        </button>
                    ) : (
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}