import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    customerId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
