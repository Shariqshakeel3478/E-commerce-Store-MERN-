import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditModal({ show, onClose, product }) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        quantity: 1,
        image: '', // Can be a string (existing image) or a File (new image)
    });

    // Fetch categories on mount
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Cannot fetch categories:', err);
            }
        };
        getCategories();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!formData.category) {
                setSubCategories([]);
                return;
            }
            try {
                const res = await axios.get('http://localhost:5000/subcategories', {
                    params: { category_id: formData.category }
                });
                setSubCategories(res.data);
            } catch (error) {
                console.error('Failed to fetch subcategories:', error);
            }
        };
        fetchSubcategories();
    }, [formData.category]);

    // When product is passed in, populate the form
    useEffect(() => {
        if (product) {
            let parsedImage = '';
            try {
                if (product.images) {
                    parsedImage = product.images.trim().startsWith('[')
                        ? JSON.parse(product.images)[0]
                        : product.images;
                }
            } catch (e) {
                console.error('Invalid JSON in product.images', e);
            }

            setFormData({
                productName: product.name || '',
                category: product.category_id || '',
                subcategory: product.subcategory_id || '',
                price: product.price || '',
                description: product.description || '',
                quantity: product.quantity || 1,
                image: parsedImage || '',
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuantityChange = (amount) => {
        setFormData(prev => {
            const newQuantity = prev.quantity + amount;
            return { ...prev, quantity: newQuantity < 1 ? 1 : newQuantity };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append("productName", formData.productName);
            form.append("category", formData.category);
            form.append("subcategory", formData.subcategory);
            form.append("price", formData.price);
            form.append("description", formData.description);
            form.append("quantity", formData.quantity);

            // Only send a new image if one is selected
            if (formData.image instanceof File) {
                form.append("images", formData.image);
            }

            await axios.put(
                `http://localhost:5000/editproduct/${product.id}`,
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Swal.fire({
                title: 'Product updated successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            });

            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product!");
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Edit Product</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div>
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
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
                                {subCategories.map((sub) => (
                                    <option key={sub.subcategory_id} value={sub.subcategory_id}>
                                        {sub.subcategory_name}
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
                                required
                            />
                        </div>
                        <div>
                            <label>Quantity</label>
                            <div className="quantity-control">
                                <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input type="number" value={formData.quantity} readOnly />
                                <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        required
                    ></textarea>

                    <label>Upload New Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) =>
                            setFormData({ ...formData, image: e.target.files[0] })
                        }
                    />

                    {/* Show current image preview if it's a string URL */}
                    {typeof formData.image === 'string' && formData.image && (
                        <div style={{ marginTop: '10px' }}>
                            <p>Current Image:</p>
                            <img
                                src={`http://localhost:5000${formData.image}`}
                                alt="Current"
                                style={{ width: '100px', borderRadius: '4px' }}
                            />
                        </div>
                    )}

                    <div className="modal-actions" style={{ marginTop: '20px' }}>
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose} className="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
