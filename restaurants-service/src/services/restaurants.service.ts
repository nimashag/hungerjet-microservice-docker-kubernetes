import { Restaurant } from '../models/restaurant.model';
import { MenuItem } from '../models/menuItem.model';

export const createRestaurant = (data: any) => Restaurant.create(data);
export const getAllRestaurants = () => Restaurant.find();
export const getRestaurantById = (id: string) => Restaurant.findById(id);
export const toggleAvailability = async (id: string) => {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return null;
    restaurant.available = !restaurant.available;
    return restaurant.save();
};


export const addMenuItem = (restaurantId: string, item: any) =>
    MenuItem.create({ ...item, restaurantId });

export const listMenuItems = (restaurantId: string) =>
    MenuItem.find({ restaurantId });

export const updateMenuItem = (itemId: string, item: any) =>
    MenuItem.findByIdAndUpdate(itemId, item, { new: true });

export const deleteMenuItem = (itemId: string) =>
    MenuItem.findByIdAndDelete(itemId);
