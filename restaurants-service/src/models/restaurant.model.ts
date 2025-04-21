import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    available: { type: Boolean, default: false },
    address: { type: String, required: true },
    image: String
});

export const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
