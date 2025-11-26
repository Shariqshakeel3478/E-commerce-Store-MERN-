import React, { useState } from 'react';
import './productmodal.css';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ProductModal({ onProductAdded, categories, subCategories, formData, setFormData }) {
    const [showModal, setShowModal] = useState(false);
    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFormData((prev) => ({ ...prev, category: value, subcategory: '' }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleQuantityChange = (amount) => {
        setFormData((prevData) => {
            const newQuantity = prevData.quantity + amount;
            return {
                ...prevData,
                quantity: newQuantity < 1 ? 1 : newQuantity,
            };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        setFormData((prev) => ({ ...prev, thumbnailIndex: 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append('productName', formData.productName);
            form.append('category', formData.category);
            form.append('subcategory', formData.subcategory);
            form.append('price', formData.price);
            form.append('description', formData.description);
            form.append('quantity', formData.quantity);
            form.append('thumbnailIndex', formData.thumbnailIndex); 

            images.forEach((img) => {
                form.append('images', img);
            });

            const response = await axios.post('http://localhost:5000/addproduct', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Swal.fire({
                icon: 'success',
                title: 'Product added successfully!',
                showConfirmButton: false,
                timer: 1500,
            });

            if (onProductAdded) onProductAdded();

            setShowModal(false);
            setFormData({
                productName: '',
                category: '',
                subcategory: '',
                price: '',
                description: '',
                quantity: 1,
                thumbnailIndex: 0
            });
            setImages([]);
        } catch (err) {
            console.error('Error uploading product:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to add product!',
                text: 'Something went wrong.',
            });
        }
    };

    return (
        <div>
            <button className="open-modal-btn" onClick={() => setShowModal(true)}>
                Add Product
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleSubmit}>

                            <div className="form-row">
                                <div>
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} required>
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Subcategory</label>
                                    <select
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Subcategory</option>
                                        {subCategories.map((item) => (
                                            <option key={item.subcategory_id} value={item.subcategory_id}>
                                                {item.subcategory_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div>
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Quantity</label>
                                    <div className="quantity-control">
                                        <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                                        <input type="number" name="quantity" value={formData.quantity} readOnly />
                                        <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
                                    </div>
                                </div>
                            </div>

                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="3"
                                required
                            ></textarea>

                            <label>Upload Images (Max 5)</label>
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />


                            <div className="image-preview">
                                {images.map((img, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'inline-block',
                                            textAlign: 'center',
                                            marginRight: '10px'
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="preview"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '8px',
                                                border:
                                                    formData.thumbnailIndex === i
                                                        ? '3px solid green'
                                                        : '1px solid #ccc',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    thumbnailIndex: i
                                                }))
                                            }
                                        />
                                        <div style={{ fontSize: '12px' }}>
                                            {formData.thumbnailIndex === i ? 'Thumbnail' : 'Select'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <button type="submit">Submit</button>
                                <button
                                    type="button"
                                    className="cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
