import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:31000';

export const fetchRestaurants = () => axios.get(`${API_BASE}/api/restaurants`);
export const fetchOrders = () => axios.get(`${API_BASE}/api/orders`);
