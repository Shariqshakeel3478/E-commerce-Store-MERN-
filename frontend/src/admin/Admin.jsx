import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import './components/admin.css';
import ProductDisplay from './components/ProductDisplay';
import UserDisplay from './components/UserDisplay';
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import OrderDisplay from './components/OrderDisplay';
import CategoryDisplay from './components/CategoryDisplay'
import axios from 'axios';


export default function Admin({ logout }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        quantity: 1
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



    useEffect(() => {

        const fetchOrders = async () => {
            try {

                const res = await axios.get('http://localhost:5000/ordersplaced');
                setOrders(res.data)

            }
            catch (err) {
                console.log("no data fetched", err)
            }
        }


        fetchOrders()
    }, [])


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/users");
                setUsers(res.data);
            } catch (err) {
                console.log("users not found");
            }
        };

        fetchUsers();
    }, []);



    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard orders={orders} users={users} setOrders={setOrders} />;
            case "products":
                return <ProductDisplay categories={categories} subCategories={subCategories} formData={formData} setFormData={setFormData} />;
            case "users":
                return <UserDisplay users={users} setUsers={setUsers} />;
            case "settings":
                return <h2 style={{ textAlign: "center" }}>Settings Coming Soon ⚙️</h2>;

            case "orders":
                return <OrderDisplay orders={orders} setOrders={setOrders} />

            case "Categories":
                return <CategoryDisplay categories={categories} setCategories={setCategories} subCategories={subCategories} setSubCategories={setSubCategories} />
            default:
                return <Dashboard users={users} setUsers={setUsers} />;
        }
    };

    return (
        <div className="adminPanel">

            <aside className="sidebar-wrapper">
                <div className="sidebar-profile">
                    <FaUserCircle className="profile-icon" />
                    <p className="greeting">Hello, {users.map((user) => {
                        if (user.role === 'admin') {
                            return user.name
                        }
                    })}</p>
                </div>

                <ul className="sidebar-menu">
                    <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
                    <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Products</li>
                    <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</li>
                    <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</li>
                    <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</li>
                    <li className={activeTab === "Categories" ? "active" : ""} onClick={() => setActiveTab("Categories")}>Categories</li>
                </ul>
            </aside>


            <div className="dashboard-wrapper">

                <nav className="admin-navbar">
                    <div className="navbar-left">
                        <h2 className="navbar-title">Admin Panel</h2>
                    </div>

                    <div className="navbar-right">
                        <FaBell className="navbar-icon" title="Notifications" />
                        <FaUserCircle className="navbar-icon profile" title="Profile" />
                        <button className="logout-btn">
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </nav>
                <div className='render'>

                    {renderContent()}
                </div>



            </div>
        </div>
    );
}
