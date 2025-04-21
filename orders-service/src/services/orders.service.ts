import { Order } from '../models/order.model';

export default class OrdersService {
    static createOrder(data: any) {
        return Order.create(data);
    }

    static getAllOrders() {
        return Order.find();
    }

    static getOrderById(id: string) {
        return Order.findById(id);
    }

    static updateOrder(id: string, data: any) {
        return Order.findByIdAndUpdate(id, data, { new: true });
    }

    static deleteOrder(id: string) {
        return Order.findByIdAndDelete(id);
    }
}