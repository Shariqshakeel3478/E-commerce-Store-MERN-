import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Product_description() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then((response) => {
                console.log("API Response:", response.data);
                setProducts(response.data);
                console.log(products)
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div className="product-des-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
            {products.map((product) => (
                <div key={product.product_id} className="product-card" style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>


                    {product.images && product.images.length > 0 ? (
                        <img
                            src={`http://localhost:5000${product.images.find(img => img.is_thumbnail)?.image_path || product.images[0].image_path}`}
                            alt={product.name}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    ) : (
                        <div style={{ height: '200px', background: '#f0f0f0', borderRadius: '8px' }}>No Image</div>
                    )}


                    <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
                    <p><b>Category:</b> {product.category_name}</p>
                    <p><b>Price:</b> Rs. {product.price}</p>
                    <p><b>Quantity:</b> {product.quantity}</p>
                    <p style={{ fontSize: '14px', color: '#555' }}>{product.description}</p>


                    {product.images && product.images.length > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '5px' }}>
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000${img.image_path}`}
                                    alt={`img-${index}`}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
