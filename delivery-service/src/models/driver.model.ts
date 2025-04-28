import { Schema, model, Document } from 'mongoose';

export interface DriverDocument extends Document {
  userId: string;
  pickupLocation: string;
  deliveryLocations: string[];
  vehicleRegNumber: string;
  mobileNumber: string;
  isAvailable: boolean;
  profileImage?: string; 
}

const driverSchema = new Schema<DriverDocument>(
  {
    userId: { type: String, required: true },
    pickupLocation: { type: String},
    deliveryLocations: { type: [String] },
    vehicleRegNumber: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    profileImage: { type: String }, 
  },
  { timestamps: true }
);

export const Driver = model<DriverDocument>('Driver', driverSchema);
