import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    name: String,
    price: Number,
});

export const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
