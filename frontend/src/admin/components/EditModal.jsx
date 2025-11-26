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
        images: [],
        thumbnailIndex: 0,
    });

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


    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!formData.category) {
                setSubCategories([]);
                return;
            }
            try {
                const res = await axios.get('http://localhost:5000/subcategories', {
                    params: { category_id: formData.category },
                });
                setSubCategories(res.data);
            } catch (error) {
                console.error('Failed to fetch subcategories:', error);
            }
        };
        fetchSubcategories();
    }, [formData.category]);


    useEffect(() => {
        if (product) {

            let displayImage = '';
            if (Array.isArray(product.images) && product.images.length > 0) {
                const thumb = product.images.find((img) => img.is_thumbnail === 1);
                displayImage = thumb ? thumb.image_path : product.images[0].image_path;
            }

            setFormData({
                productName: product.name || '',
                category: product.category_id || '',
                subcategory: product.subcategory_id || '',
                price: product.price || '',
                description: product.description || '',
                quantity: product.quantity || 1,
                image: displayImage || '',
            });
        }
    }, [product]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleQuantityChange = (amount) => {
        setFormData((prev) => {
            const newQuantity = prev.quantity + amount;
            return { ...prev, quantity: newQuantity < 1 ? 1 : newQuantity };
        });
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

            // Only append if new image selected
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((img) => {
                    form.append('images', img);
                });
                form.append('thumbnailIndex', formData.thumbnailIndex);
            }


            await axios.put(`http://localhost:5000/editproduct/${product.product_id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Swal.fire({
                title: 'Product updated successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            });

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire('Error', 'Failed to update product!', 'error');
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
                                <button type="button" onClick={() => handleQuantityChange(-1)}>
                                    -
                                </button>
                                <input type="number" value={formData.quantity} readOnly />
                                <button type="button" onClick={() => handleQuantityChange(1)}>
                                    +
                                </button>
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
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
                    />


                    {formData.images && formData.images.length > 0 ? (
                        <div className="image-preview">
                            {formData.images.map((img, i) => (
                                <div key={i} style={{ display: 'inline-block', textAlign: 'center', marginRight: '10px' }}>
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt="preview"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '8px',
                                            border: formData.thumbnailIndex === i ? '3px solid green' : '1px solid #ccc',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setFormData((prev) => ({ ...prev, thumbnailIndex: i }))}
                                    />
                                    <div style={{ fontSize: '12px' }}>
                                        {formData.thumbnailIndex === i ? 'Thumbnail' : 'Select'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <p>Current Images:</p>
                            {Array.isArray(product.images) &&
                                product.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={`http://localhost:5000${img.image_path}`}
                                        alt="Existing"
                                        style={{ width: '80px', marginRight: '8px', borderRadius: '8px' }}
                                    />
                                ))}
                        </>
                    )}


                    <div className="modal-actions" style={{ marginTop: '20px' }}>
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose} className="cancel">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
