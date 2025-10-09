import React from "react";
import "./adminNavbar.css";
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    return (
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
    );
}
