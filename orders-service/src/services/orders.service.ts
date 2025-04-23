import { Order } from '../models/order.model';

export const createOrder = (data: any, userId: string) => Order.create({ ...data, userId });

export const getAllOrders = () => Order.find();

export const getOrderById = (id: string) => Order.findById(id);

export const updateOrder = async (id: string, data: any) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedOrder;
};

export const deleteOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

// export default class OrdersService {
    

//     static getAllOrders() {
//         return Order.find();
//     }

//     static getOrderById(id: string) {
//         return Order.findById(id);
//     }

//     static updateOrder(id: string, data: any) {
//         return Order.findByIdAndUpdate(id, data, { new: true });
//     }

//     static deleteOrder(id: string) {
//         return Order.findByIdAndDelete(id);
//     }
// }