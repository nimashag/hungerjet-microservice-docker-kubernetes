import { Request, Response } from "express";
import * as OrdersService from "../services/orders.service";
import { AuthenticatedRequest } from "../middlewares/auth";
import { fetchMenuItems, fetchRestaurant } from "../api/restaurant.api";

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("▶️ Creating a new order:", req.body);

    const {
      items,
      status,
      deliveryAddress,
      totalAmount,
      paymentStatus,
      paymentMethod,
      specialInstructions,
      restaurantId,
    } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // 🔗 Fetch menu items from the restaurant service
    const menuItems = await fetchMenuItems(restaurantId);
    if (!menuItems || menuItems.length === 0) {
      return res.status(400).json({ message: "No menu items found for this restaurant." });
    }

    const order = await OrdersService.createOrder(
      {
        items,
        status,
        deliveryAddress,
        totalAmount,
        paymentStatus,
        paymentMethod,
        specialInstructions,
        restaurantId,
      },
      req.user.id
    );

    console.log("✅ Created order with ID:", order._id);
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  console.log("▶️ Fetching order with ID:", req.params.id);
  const order = await OrdersService.getOrderById(req.params.id);
  if (!order) {
    console.warn("Order not found:", req.params.id);
  } else {
    console.log("Order found:", order._id);
  }
  res.json(order);
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    console.log("▶️ Fetching all orders");
    const orders = await OrdersService.getAllOrders();
    console.log(`Found ${orders.length} restaurants`);
    res.json(orders);
  } catch (err) {
    console.error("Error getting all orders:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update delivery address
export const updateDeliveryAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const updatedOrder = await OrdersService.updateOrder(id, { deliveryAddress });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating delivery address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update special instructions
export const updateSpecialInstructions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { specialInstructions } = req.body;

    if (specialInstructions === undefined) {
      return res.status(400).json({ message: "Special instructions are required" });
    }

    const updatedOrder = await OrdersService.updateOrder(id, { specialInstructions });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating special instructions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//restaurantAdmin
export const getByRestaurantId = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    console.log(`▶️ Fetching orders for restaurant ID: ${restaurantId}`);

    const orders = await OrdersService.getOrdersByRestaurantId(restaurantId);

    console.log(
      `✅ Found ${orders.length} orders for restaurant ID: ${restaurantId}`
    );
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by restaurant ID:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//restaurantAdmin
export const update = async (req: Request, res: Response) => {
  try {
    console.log("▶️ Updating order ID:", req.params.id);

    const updateData: any = { ...req.body };

    const updated = await OrdersService.updateOrder(req.params.id, updateData);

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("✅ Updated order:", updated._id);
    res.json(updated);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    console.log("▶️ Deleting order with ID:", req.params.id);

    const deletedOrder = await OrdersService.deleteOrder(req.params.id);

    if (!deletedOrder) {
      console.warn("Order not found for deletion:", req.params.id);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("✅ Deleted order:", req.params.id);
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCurrentUserOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    console.log(`▶️ Fetching orders for user: ${req.user.id}`);
    const orders = await OrdersService.getOrdersByUserId(req.user.id);
    console.log(`Found ${orders.length} orders for user`);
    
    res.json(orders);
  } catch (err) {
    console.error("Error getting user orders:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    // For restaurant admin, verify they own this order's restaurant
    if (req.user.role === 'restaurantAdmin') {
      const order = await OrdersService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if admin has restaurantId and if order belongs to admin's restaurant
      if (!req.user.restaurantId || order.restaurantId.toString() !== req.user.restaurantId) {
        return res.status(403).json({ message: "Not authorized to update this order" });
      }
    }
    
    console.log(`▶️ Updating status for order ${orderId} to ${status}`);
    const updatedOrder = await OrdersService.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    console.log(`✅ Updated order status: ${updatedOrder._id}`);
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const processPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const orderId = req.params.id;
    const paymentDetails = req.body;
    
    console.log(`▶️ Processing payment for order ${orderId}`);
    
    // Validate the order belongs to the current user
    const order = await OrdersService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to process payment for this order" });
    }
    
    // In a real implementation, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment
    const updatedOrder = await OrdersService.processOrderPayment(orderId, paymentDetails);

    if (!updatedOrder) {
      return res.status(500).json({ message: "Failed to update order after payment" });
    }
    
    console.log(`✅ Payment processed for order: ${updatedOrder._id}`);
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error processing payment:", err);
    
    // Provide more specific error messages for payment failures
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: "Something went wrong processing payment" });
  }
};