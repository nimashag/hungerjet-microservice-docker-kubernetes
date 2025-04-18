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

