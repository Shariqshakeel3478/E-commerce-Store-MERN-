import React, { useState, useEffect } from 'react';
import './productDisplay.css';
import ProductModal from './ProductModal';
import EditModal from './EditModal';
import axios from 'axios';

export default function ProductDisplay({ categories, subCategories, formData, setFormData }) {
    const [myProducts, setMyProducts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const editProduct = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);

    };

    const delProduct = async (product) => {
        try {
            await axios.delete(`http://localhost:5000/delproduct/${product.product_id}`);
            alert("Product deleted successfully!");

            setMyProducts(myProducts.filter(p => p.product_id !== product.product_id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product!");
        }
    };

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then((response) => {
                setMyProducts(response.data)
                console.log(response.data)
            }
            )

            .catch((err) => console.log(err));



    }, []);

    return (
        <div className="manage-products-container">
            <ProductModal categories={categories} subCategories={subCategories} formData={formData} setFormData={setFormData} />
            <h2>Manage Products</h2>
            <table className="products-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Availability</th>
                        <th>Quantity</th>
                        <th>Images</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {myProducts.map((product) => (
                        <tr key={product.product_id}>
                            <td><input type="checkbox" /></td>
                            <td>{product.name}</td>
                            <td>{product.category_name}</td>
                            <td>
                                <span className={`status-badge ${product.quantity > 0 ? 'available' : 'unavailable'}`}>
                                    {product.quantity > 0 ? "Available" : "Unavailable"}
                                </span>
                            </td>
                            <td>{product.quantity}</td>
                            <td>
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={`http://localhost:5000${product.images[0].image_path}`}
                                        alt={product.name}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                        }}
                                    />
                                ) : (
                                    <span>No image</span>
                                )}
                            </td>
                            <td className='action-icons'>
                                <button onClick={() => editProduct(product)}>Edit</button>
                                <button onClick={() => delProduct(product)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                product={selectedProduct}
            />
        </div>
    );
}
