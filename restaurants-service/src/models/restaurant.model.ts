import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
    name: String,
    available: { type: Boolean, default: false },
});

export const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
