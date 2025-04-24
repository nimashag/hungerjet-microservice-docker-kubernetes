
import mongoose, { Document, Schema } from 'mongoose';

export interface DeliveryDocument extends Document {
  orderId: string;
  deliveryPersonId?: string;
  status: 'Pending' | 'Accepted' | 'PickedUp' | 'EnRoute' | 'Delivered' | 'Cancelled';
  location: {
    lat: number;
    lng: number;
  };
  timestamps: {
    acceptedAt?: Date;
    pickedUpAt?: Date;
    deliveredAt?: Date;
  };
  customerEmail?: string;
  customerPhone?: string;
}

const DeliverySchema = new Schema<DeliveryDocument>({
  orderId: { type: String, required: true },
  deliveryPersonId: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'PickedUp', 'EnRoute', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  timestamps: {
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
  },
  customerEmail: { type: String },
  customerPhone: { type: String }
}, { timestamps: true });

export default mongoose.model<DeliveryDocument>('Delivery', DeliverySchema);
