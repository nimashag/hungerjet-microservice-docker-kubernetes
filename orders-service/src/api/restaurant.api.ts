import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;

export const fetchMenuItems = async (restaurantId: string) => {
  const res = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/menu-items`);
  return res.data;
};

export const fetchRestaurant = async (restaurantId: string) => {
  const res = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}`);
  return res.data;
};