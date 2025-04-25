import { Cart } from '../models/cart.model';
import mongoose from 'mongoose';

// Get user's active cart or create if none exists
export const getUserCart = async (userId: string) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [], totalAmount: 0 });
  }
  return cart;
};

// Get user's cart for a specific restaurant or create if none exists
export const getUserRestaurantCart = async (userId: string, restaurantId: string) => {
  let cart = await Cart.findOne({ userId, restaurantId });
  if (!cart) {
    cart = await Cart.create({ userId, restaurantId, items: [], totalAmount: 0 });
  }
  return cart;
};

// Add item to cart
export const addItemToCart = async (userId: string, restaurantId: string, item: any) => {
  // First check if user has a cart for another restaurant
  const existingCart = await Cart.findOne({ userId });
  
  if (existingCart && existingCart.restaurantId.toString() !== restaurantId) {
    // User has a cart for a different restaurant, ask if they want to clear it
    throw new Error('DIFFERENT_RESTAURANT_CART_EXISTS');
  }
  
  // Get or create cart for this restaurant
  let cart = await getUserRestaurantCart(userId, restaurantId);
  
  // Check if this item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (i: any) => i.menuItemId.toString() === item.menuItemId.toString() && 
    JSON.stringify(i.additionalOptions) === JSON.stringify(item.additionalOptions)
  );
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item to cart
    cart.items.push(item);
  }
  
  await cart.save();
  return cart;
};

// Update item quantity
export const updateCartItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    throw new Error('Cart not found');
  }
  
  const itemIndex = cart.items.findIndex((i: any) => i._id.toString() === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    // Remove the item from cart
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }
  
  // If no items left, remove the cart
  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return null;
  }
  
  await cart.save();
  return cart;
};

// Remove item from cart
export const removeCartItem = async (userId: string, itemId: string) => {
  return updateCartItemQuantity(userId, itemId, 0);
};

// Clear cart
export const clearCart = async (userId: string) => {
  await Cart.findOneAndDelete({ userId });
  return { success: true };
};

// Convert cart to order
export const convertCartToOrder = async (
  userId: string, 
  paymentMethod: string,
  deliveryAddress: any,
  specialInstructions: string = ''
) => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }
  
  // This would use your existing Order model and createOrder service
  // You'd transform the cart data into an order
  const orderData = {
    userId,
    restaurantId: cart.restaurantId,
    items: cart.items,
    totalAmount: cart.totalAmount,
    status: 'Pending',
    deliveryAddress,
    paymentStatus: 'Pending',
    paymentMethod,
    specialInstructions
  };
  
  // Import and use your existing order service
  // const order = await createOrder(orderData, userId);
  
  // Clear the cart after creating the order
  await clearCart(userId);
  
  // Return the created order
  // return order;
  return orderData; // Replace with the above when integrated
};