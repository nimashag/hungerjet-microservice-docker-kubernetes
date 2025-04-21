import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String
});

export const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
