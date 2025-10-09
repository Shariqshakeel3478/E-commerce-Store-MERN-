
import axios from 'axios'
import './orderdisplay.css'


export default function OrderDisplay({ orders, setOrders }) {




    const handleStatusChange = async (orderId, newStatus) => {
        try {

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.order_id === orderId
                        ? { ...order, order_status: newStatus }
                        : order
                )
            );

            // backend me update request
            await axios.put(`http://localhost:5000/ordersplaced/${orderId}`, {
                order_status: newStatus,
            });

            console.log(`Order ${orderId} status updated to ${newStatus}`);
        } catch (err) {
            console.log("Error updating status:", err);
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'delivered';
            case 'pending':
                return 'pending';
            case 'cancelled':
                return 'cancelled';
            default:
                return '';
        }
    };



    return (
        <div className="table-container">
            <h1>Order Summary</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.user_name}</td>
                            <td>{order.order_date.split('T')[0]}</td>
                            <td>
                                <select
                                    className={`status-badge ${getStatusClass(order.order_status)}`}

                                    value={order.order_status}
                                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>{order.total_amount}</td>
                            <td>{order.payment_method}</td>
                            <td>
                                <span className={`payment-status ${order.payment_status.toLowerCase()}`}>
                                    {order.payment_status}
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
