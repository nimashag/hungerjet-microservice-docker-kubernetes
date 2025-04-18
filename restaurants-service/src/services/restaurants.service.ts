import { Restaurant } from '../models/restaurant.model';

export const createRestaurant = (data: any) => Restaurant.create(data);
export const getAllRestaurants = () => Restaurant.find();
export const getRestaurantById = (id: string) => Restaurant.findById(id);
export const toggleAvailability = (id: string) => Restaurant.findByIdAndUpdate(id, { $bit: { available: { xor: 1 } } }, { new: true });

