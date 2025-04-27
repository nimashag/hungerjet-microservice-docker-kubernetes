import axios from 'axios';

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;

export const fetchMenuItems = async (restaurantId: string) => {
  const res = await axios.get(`http://localhost:3001/api/restaurants/${restaurantId}/menu-items`);
  return res.data;
};

export const fetchRestaurant = async (restaurantId: string) => {
  const res = await axios.get(`http://localhost:3001/api/restaurants/${restaurantId}`);
  return res.data;
};