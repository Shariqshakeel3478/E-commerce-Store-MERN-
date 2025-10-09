import React, { useState, useEffect } from 'react';
import './productmodal.css';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function ProductModal() {
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        quantity: 1

    });

    const [images, setImages] = useState([]);



    // Sub Categories

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
                console.error('Failed to fetch subcategories', error);
            }
        };
        fetchSubcategories();
    }, [formData.category], []);


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



    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset subcategory when category changes
        if (name === 'category') {
            setFormData((prev) => ({
                ...prev,
                category: value,
                subcategory: '',
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
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
        setImages(Array.from(e.target.files));
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


            images.forEach((img) => {
                form.append('images', img);
            });

            const response = await axios.post('http://localhost:5000/addproduct', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Success:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Product added successfully!',
                showConfirmButton: false,
                timer: 1500,
            });

            setShowModal(false);
            setFormData({
                productName: '',
                category: '',
                subcategory: '',
                price: '',
                description: '',
                quantity: 1
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
                                    <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
                                        <option value="">Select Subcategory</option>
                                        {subCategories.map((item) => (
                                            <option key={item.subcategory_id} value={item.subcategory_id}>
                                                {item.subcategory_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Price + Quantity */}
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

                            {/* Description */}
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="3"
                                required
                            ></textarea>

                            {/* Image Upload */}
                            <label>Upload Images (Max 5)</label>
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />

                            {/* Image Preview */}
                            <div className="image-preview">
                                {images.length > 0 &&
                                    images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={URL.createObjectURL(img)}
                                            alt="preview"
                                            style={{ width: '80px', marginRight: '8px', borderRadius: '8px' }}
                                        />
                                    ))}
                            </div>

                            {/* Actions */}
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
