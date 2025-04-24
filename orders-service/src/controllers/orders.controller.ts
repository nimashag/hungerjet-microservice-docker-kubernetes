import { Request, Response } from "express";
import * as OrdersService from "../services/orders.service";
import { AuthenticatedRequest } from "../middlewares/auth";

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("▶️ Creating a new order:", req.body);

    const {
      items,
      status,
      totalAmount,
      deliveryAddress,
      paymentStatus,
      paymentMethod,
      specialInstructions,
      restaurantId,
    } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const order = await OrdersService.createOrder(
      {
        items,
        status,
        totalAmount,
        deliveryAddress,
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
