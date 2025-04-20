import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {type: String,required: true},
  name: {type: String,required: true},
  quantity: {type: Number,required: true,min: 1},
  price: {type: Number,required: true}
});

const orderSchema = new mongoose.Schema({
    customerId: {type: String,required: false},
    restaurantId: {type: String,required: true},
    items: [orderItemSchema],
    status: {type: String,enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],default: 'Pending'},
    totalAmount: {type: Number,required: true},
    deliveryAddress: {street: String,city: String,state: String,zipCode: String,country: String},
    paymentStatus: {type: String,enum: ['pending', 'paid', 'failed'],default: 'pending'},
    paymentMethod: {type: String,
    enum: ['PayHere', 'DialogGenie', 'FriMi', 'Stripe', 'PayPal'],required: true},
    specialInstructions: {type: String,default: ''}
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);