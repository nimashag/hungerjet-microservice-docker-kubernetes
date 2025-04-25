import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as CartService from '../services/cart.service';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const cart = await CartService.getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error('Error getting cart:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const { restaurantId, menuItemId, name, quantity, price, additionalOptions } = req.body;
    
    if (!restaurantId || !menuItemId || !name || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    try {
      const cart = await CartService.addItemToCart(
        req.user.id,
        restaurantId,
        { menuItemId, name, quantity, price, additionalOptions }
      );
      
      res.json(cart);
    } catch (error: any) {
      if (error.message === 'DIFFERENT_RESTAURANT_CART_EXISTS') {
        return res.status(409).json({ 
          message: 'You have items in your cart from a different restaurant',
          code: 'DIFFERENT_RESTAURANT_CART_EXISTS'
        });
      }
      throw error;
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateItemQuantity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!itemId || quantity === undefined) {
      return res.status(400).json({ message: 'Item ID and quantity are required' });
    }
    
    const cart = await CartService.updateCartItemQuantity(req.user.id, itemId, quantity);
    
    // If cart is null, it means it was deleted (no items left)
    if (!cart) {
      return res.json({ message: 'Cart is now empty' });
    }
    
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const removeItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const { itemId } = req.params;
    
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    
    const result = await CartService.removeCartItem(req.user.id, itemId);
    res.json(result || { message: 'Cart is now empty' });
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    await CartService.clearCart(req.user.id);
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const { paymentMethod, deliveryAddress, specialInstructions } = req.body;
    
    if (!paymentMethod || !deliveryAddress) {
      return res.status(400).json({ message: 'Payment method and delivery address are required' });
    }
    
    const order = await CartService.convertCartToOrder(
      req.user.id,
      paymentMethod,
      deliveryAddress,
      specialInstructions
    );
    
    res.json(order);
  } catch (err: any) {
    console.error('Error during checkout:', err);
    
    if (err.message === 'Cart is empty') {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    
    res.status(500).json({ message: 'Something went wrong' });
  }
};