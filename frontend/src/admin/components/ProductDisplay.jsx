import React, { useState, useEffect } from 'react'
import './productDisplay.css'
import ProductModal from './ProductModal'
import EditModal from './EditModal'
import axios from 'axios'

export default function ProductDisplay() {
    const [myProducts, setMyProducts] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const editProduct = (product) => {
        setSelectedProduct(product)
        setShowEditModal(true)
        console.log(product)

    }

    // delete product from admin
    const delProduct = async (product) => {
        try {
            const res = await axios.delete(`http://localhost:5000/delproduct/${product.id}`);
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product!");
        }
    }


    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then((response) => setMyProducts(response.data))
            .catch((err) => console.log(err))
    }, [])

    return (
        <div className="manage-products-container">
            <ProductModal />

            <h2>Manage Products</h2>
            <table className="products-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Availability</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {myProducts.map((product) => (
                        <tr key={product.id}>
                            <td><input type="checkbox" /></td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td><span className="status-badge">{product.quantity > 0 ? "Available" : "Unavailable"}</span></td>
                            <td>{product.quantity}</td>
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
    )
}
