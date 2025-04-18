import { Request, Response } from 'express';
import OrdersService from '../services/orders.service';

export default class OrdersController {
    static async create(req: Request, res: Response) {
        console.log('▶️ Creating a new order:', req.body);  // Log incoming request data

        try {
            const order = await OrdersService.createOrder(req.body);
            console.log('Order created successfully:', order);  // Log successful creation
            res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);  // Log any errors
            res.status(500).send('Error creating order');
        }
    }

    static async getAll(req: Request, res: Response) {
        console.log('▶️ Fetching all orders');  // Log the action

        try {
            const orders = await OrdersService.getAllOrders();
            console.log('Orders fetched successfully:', orders);  // Log successful fetch
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);  // Log any errors
            res.status(500).send('Error fetching orders');
        }
    }

    static async getById(req: Request, res: Response) {
        console.log('▶️ Fetching order with ID:', req.params.id);  // Log incoming request

        try {
            const order = await OrdersService.getOrderById(req.params.id);
            if (!order) {
                console.log('Order not found with ID:', req.params.id);  // Log when order is not found
                return res.status(404).send('Order not found');
            }
            console.log('Order found:', order);  // Log successful fetch
            res.json(order);
        } catch (error) {
            console.error('Error fetching order by ID:', error);  // Log any errors
            res.status(500).send('Error fetching order');
        }
    }

    static async update(req: Request, res: Response) {
        console.log('▶️ Updating order with ID:', req.params.id, 'Data:', req.body);  // Log incoming request

        try {
            const updated = await OrdersService.updateOrder(req.params.id, req.body);
            if (!updated) {
                console.log('Order not found for update with ID:', req.params.id);  // Log when order is not found
                return res.status(404).send('Order not found');
            }
            console.log('Order updated successfully:', updated);  // Log successful update
            res.json(updated);
        } catch (error) {
            console.error('Error updating order:', error);  // Log any errors
            res.status(500).send('Error updating order');
        }
    }

    static async delete(req: Request, res: Response) {
        console.log('▶️ Deleting order with ID:', req.params.id);  // Log incoming request

        try {
            const deleted = await OrdersService.deleteOrder(req.params.id);
            if (!deleted) {
                console.log('Order not found for deletion with ID:', req.params.id);  // Log when order is not found
                return res.status(404).send('Order not found');
            }
            console.log('Order deleted successfully:', req.params.id);  // Log successful deletion
            res.json({ message: 'Order deleted' });
        } catch (error) {
            console.error('Error deleting order:', error);  // Log any errors
            res.status(500).send('Error deleting order');
        }
    }
}
