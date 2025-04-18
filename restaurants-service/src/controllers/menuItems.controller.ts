import { Request, Response } from 'express';
import * as menuItemsService from '../services/menuItems.service';

export const addMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Adding menu item for restaurant ID:', req.params.id, 'Item:', req.body);
    const item = await menuItemsService.addMenuItem(req.params.id, req.body);
    console.log('Added menu item with ID:', item._id);
    res.json(item);
};

export const listMenuItems = async (req: Request, res: Response) => {
    console.log('▶️ Fetching menu items for restaurant ID:', req.params.id);
    const items = await menuItemsService.listMenuItems(req.params.id);
    console.log(`Found ${items.length} menu items`);
    res.json(items);
};

export const updateMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Updating menu item ID:', req.params.itemId, 'Payload:', req.body);
    const item = await menuItemsService.updateMenuItem(req.params.itemId, req.body);
    console.log('Updated menu item:', item?._id);
    res.json(item);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Deleting menu item ID:', req.params.itemId);
    const item = await menuItemsService.deleteMenuItem(req.params.itemId);
    console.log('Deleted menu item:', item?._id);
    res.json(item);
};
