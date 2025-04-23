import { Request, Response } from 'express';
import * as OrdersService from '../services/orders.service';
import { AuthenticatedRequest } from '../middlewares/auth';

export const create = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log("▶️ Creating a new order:", req.body);

        const {items, status, totalAmount, deliveryAddress, paymentStatus, paymentMethod, specialInstructions, restaurantId } = req.body;

        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const order = await OrdersService.createOrder(
            {items, status, totalAmount, deliveryAddress, paymentStatus, paymentMethod, specialInstructions, restaurantId },
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

export const update = async (req: Request, res: Response) => {
    try {
        console.log("▶️ Updating order ID:", req.params.id);

        const updateData: any = { ...req.body };

        const updated = await OrdersService.updateOrder(
            req.params.id,
            updateData
        );

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

// export default class OrdersController {

//     // Helper method to calculate order total
//     private static calculateOrderTotal(items: any[]): number {
//         return items.reduce((total, item) => {
//             return total + (item.price * item.quantity);
//         }, 0);
//     }

//     static async getAll(req: Request, res: Response) {
//         console.log('▶️ Fetching all orders');  // Log the action

//         try {
//             const orders = await OrdersService.getAllOrders();
//             console.log('Orders fetched successfully:', orders);  // Log successful fetch
//             res.json(orders);
//         } catch (error) {
//             console.error('Error fetching orders:', error);  // Log any errors
//             res.status(500).send('Error fetching orders');
//         }
//     }

//     static async getById(req: Request, res: Response) {
//         console.log('▶️ Fetching order with ID:', req.params.id);  // Log incoming request

//         try {
//             const order = await OrdersService.getOrderById(req.params.id);
//             if (!order) {
//                 console.log('Order not found with ID:', req.params.id);  // Log when order is not found
//                 return res.status(404).send('Order not found');
//             }
//             console.log('Order found:', order);  // Log successful fetch
//             res.json(order);
//         } catch (error) {
//             console.error('Error fetching order by ID:', error);  // Log any errors
//             res.status(500).send('Error fetching order');
//         }
//     }

//     static async update(req: Request, res: Response) {
//         console.log('▶️ Updating order with ID:', req.params.id, 'Data:', req.body);  // Log incoming request

//         try {
//             const updated = await OrdersService.updateOrder(req.params.id, req.body);
//             if (!updated) {
//                 console.log('Order not found for update with ID:', req.params.id);  // Log when order is not found
//                 return res.status(404).send('Order not found');
//             }
//             console.log('Order updated successfully:', updated);  // Log successful update
//             res.json(updated);
//         } catch (error) {
//             console.error('Error updating order:', error);  // Log any errors
//             res.status(500).send('Error updating order');
//         }
//     }

//     static async delete(req: Request, res: Response) {
//         console.log('▶️ Deleting order with ID:', req.params.id);  // Log incoming request

//         try {
//             const deleted = await OrdersService.deleteOrder(req.params.id);
//             if (!deleted) {
//                 console.log('Order not found for deletion with ID:', req.params.id);  // Log when order is not found
//                 return res.status(404).send('Order not found');
//             }
//             console.log('Order deleted successfully:', req.params.id);  // Log successful deletion
//             res.json({ message: 'Order deleted' });
//         } catch (error) {
//             console.error('Error deleting order:', error);  // Log any errors
//             res.status(500).send('Error deleting order');
//         }
//     }

//     static async updateStatus(req: Request, res: Response) {
//         const { id } = req.params;
//         const { status } = req.body;
        
//         console.log(`▶️ Updating order ${id} status to: ${status}`);
        
//         try {
//             // Validate status value
//             const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
//             if (!validStatuses.includes(status)) {
//                 return res.status(400).json({ 
//                     message: 'Invalid status value',
//                     validValues: validStatuses
//                 });
//             }
            
//             const updated = await OrdersService.updateOrder(id, { status });
//             if (!updated) {
//                 console.log('Order not found for status update with ID:', id);
//                 return res.status(404).json({ message: 'Order not found' });
//             }
//             console.log('Order status updated successfully:', updated);
//             res.json(updated);
//         } catch (error) {
//             console.error('Error updating order status:', error);
//             res.status(500).json({ message: 'Error updating order status' });
//         }
//     }
// }
