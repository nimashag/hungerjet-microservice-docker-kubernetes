import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
    name: String,
    available: { type: Boolean, default: false },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
