import { MenuItem } from '../models/menuItem.model';

export const addMenuItem = (restaurantId: string, item: any) =>
    MenuItem.create({ ...item, restaurantId });

export const listMenuItems = (restaurantId: string) =>
    MenuItem.find({ restaurantId });

export const updateMenuItem = (itemId: string, item: any) =>
    MenuItem.findByIdAndUpdate(itemId, item, { new: true });

export const deleteMenuItem = (itemId: string) =>
    MenuItem.findByIdAndDelete(itemId);
