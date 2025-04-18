import { Request, Response } from 'express';
import * as restaurantsService from '../services/restaurants.service';

export const create = async (req: Request, res: Response) => {
    console.log('▶️ Creating a new restaurant:', req.body);
    const restaurant = await restaurantsService.createRestaurant(req.body);
    console.log('Created restaurant with ID:', restaurant._id);
    res.json(restaurant);
};

export const list = async (_req: Request, res: Response) => {
    console.log('▶️ Fetching all restaurants');
    const restaurants = await restaurantsService.getAllRestaurants();
    console.log(`Found ${restaurants.length} restaurants`);
    res.json(restaurants);
};

export const getOne = async (req: Request, res: Response) => {
    console.log('▶️ Fetching restaurant with ID:', req.params.id);
    const restaurant = await restaurantsService.getRestaurantById(req.params.id);
    if (!restaurant) {
        console.warn('Restaurant not found:', req.params.id);
    } else {
        console.log('Restaurant found:', restaurant.name);
    }
    res.json(restaurant);
};

export const toggleAvailability = async (req: Request, res: Response) => {
    console.log('▶️ Toggling availability for restaurant ID:', req.params.id);
    const updated = await restaurantsService.toggleAvailability(req.params.id);
    console.log('Updated availability to:', updated?.available);
    res.json(updated);
};

export const addMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Adding menu item for restaurant ID:', req.params.id, 'Item:', req.body);
    const item = await restaurantsService.addMenuItem(req.params.id, req.body);
    console.log('Added menu item with ID:', item._id);
    res.json(item);
};

export const listMenuItems = async (req: Request, res: Response) => {
    console.log('▶️ Fetching menu items for restaurant ID:', req.params.id);
    const items = await restaurantsService.listMenuItems(req.params.id);
    console.log(`Found ${items.length} menu items`);
    res.json(items);
};

export const updateMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Updating menu item ID:', req.params.itemId, 'Payload:', req.body);
    const item = await restaurantsService.updateMenuItem(req.params.itemId, req.body);
    console.log('Updated menu item:', item?._id);
    res.json(item);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Deleting menu item ID:', req.params.itemId);
    const item = await restaurantsService.deleteMenuItem(req.params.itemId);
    console.log('Deleted menu item:', item?._id);
    res.json(item);
};

