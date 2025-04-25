import mongoose from 'mongoose';

interface AdditionalOption {
    name: string;
    price: number;
  }

const cartItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  additionalOptions: [{ 
    name: String,
    price: Number 
  }]
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// And in the pre-save hook, add a safe check
cartSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((sum, item) => {
      // Include base price
      let itemTotal = item.price * item.quantity;
      
      // Add additional options with a safety check
      if (item.additionalOptions && item.additionalOptions.length) {
        itemTotal += item.additionalOptions.reduce((optSum, opt) => 
          optSum + (opt.price || 0), 0
        ) * item.quantity;
      }
      
      return sum + itemTotal;
    }, 0);
    
    this.lastUpdated = new Date();
    next();
  });

export const Cart = mongoose.model('Cart', cartSchema);