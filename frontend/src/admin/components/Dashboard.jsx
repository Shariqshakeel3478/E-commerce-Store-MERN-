import React from 'react'
import DashboardCards from './DashboardCards';
import OrderDisplay from './OrderDisplay';


export default function Dashboard({ orders, setOrders, users }) {
    return (
        <div style={{ flex: 1, padding: '20px' }}>
            <h1>Dashboard</h1>

            <DashboardCards orders={orders} setOrders={setOrders} users={users} />


        </div>
    )
}
