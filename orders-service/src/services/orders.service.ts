import { Order } from '../models/order.model';

export const createOrder = (data: any, userId: string) => Order.create({ ...data, userId });

export const getAllOrders = () => Order.find();

export const getOrderById = (id: string) => Order.findById(id);

export const getOrdersByRestaurantId = (restaurantId: string) => {
  return Order.find({ restaurantId });
};

export const updateOrder = async (id: string, data: any) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedOrder;
};

export const deleteOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

export const getOrdersByUserId = (userId: string) => Order.find({ userId });

export const getOrdersByRestaurantId = (restaurantId: string) => Order.find({ restaurantId });

export const updateOrderStatus = async (id: string, status: string) => {
  return await Order.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true }
  );
};

export const processOrderPayment = async (id: string, paymentDetails: any) => {
  // In a real implementation, you would integrate with payment gateway here
  // This is a simplified version
  const order = await Order.findById(id);
  
  if (!order) {
    throw new Error("Order not found");
  }
  
  if (order.paymentStatus === 'paid') {
    throw new Error("Order is already paid");
  }
  
  // Update payment status to paid and order status to confirmed
  return await Order.findByIdAndUpdate(
    id,
    { 
      paymentStatus: 'paid',
      status: 'Confirmed',
      paymentMethod: paymentDetails.method,
      // You might store transaction ID or other payment reference here
      paymentReference: paymentDetails.transactionId
    },
    { new: true }
  );
};