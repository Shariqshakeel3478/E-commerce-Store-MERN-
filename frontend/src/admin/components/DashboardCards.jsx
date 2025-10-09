import React from 'react';
import './dashboardcards.css';
import { FaMoneyBillWave, FaShoppingCart, FaUsers, FaUserTie } from "react-icons/fa";

export default function DashboardCards({ orders, users }) {


    return (
        <div className="cards-container">


            <div className="dashboard-card">
                <div className="icon-circle" style={{ backgroundColor: '#34d399' }}>
                    <FaMoneyBillWave />
                </div>
                <div className="card-info">
                    <h3 className="card-value">$153,000</h3>
                    <p className="card-title">Revenue</p>
                </div>
            </div>


            <div className="dashboard-card">
                <div className="icon-circle" style={{ backgroundColor: '#60a5fa' }}>
                    <FaShoppingCart />
                </div>
                <div className="card-info">
                    <h3 className="card-value">{orders.length}</h3>
                    <p className="card-title">Orders</p>
                </div>
            </div>


            <div className="dashboard-card">
                <div className="icon-circle" style={{ backgroundColor: '#fbbf24' }}>
                    <FaUsers />
                </div>
                <div className="card-info">
                    <h3 className="card-value">{users.length}</h3>
                    <p className="card-title">users</p>
                </div>
            </div>

            {/* Employees Card */}
            <div className="dashboard-card">
                <div className="icon-circle" style={{ backgroundColor: '#a78bfa' }}>
                    <FaUserTie />
                </div>
                <div className="card-info">
                    <h3 className="card-value">20</h3>
                    <p className="card-title">Employees</p>
                </div>
            </div>
        </div>
    );
}
