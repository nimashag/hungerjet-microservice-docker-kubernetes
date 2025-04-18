import { useEffect, useState } from 'react';
import { fetchOrders } from '../api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        fetchOrders().then(res => setOrders(res.data));
    }, []);
    return (
        <div>
            <h2>Orders</h2>
            <ul>
                {orders.map((o: any) => (
                    <li key={o._id}>{o.customerId} - {o.product} x {o.quantity} @ {o.price}</li>
                ))}
            </ul>
        </div>
    );
}