import Delivery from '../models/delivery.model';

export const createDelivery = async (data: any) => {
  return await Delivery.create(data);
};

export const assignDriver = async (deliveryId: string) => {
  // TODO: Implement nearest driver selection logic
  const driverId = 'driver1';
  return await Delivery.findByIdAndUpdate(deliveryId, {
    deliveryPersonId: driverId,
    status: 'Pending',
    'statusTimestamps.acceptedAt': new Date()
  }, { new: true });
};

export const acceptDelivery = async (deliveryId: string, driverId: string) => {
  return await Delivery.findByIdAndUpdate(deliveryId, {
    deliveryPersonId: driverId,
    status: 'Accepted',
    'statusTimestamps.acceptedAt': new Date()
  }, { new: true });
};

export const updateStatus = async (deliveryId: string, status: string) => {
  const update: any = { status };
  if (status === 'PickedUp') update['statusTimestamps.pickedUpAt'] = new Date();
  if (status === 'Delivered') update['statusTimestamps.deliveredAt'] = new Date();
  return await Delivery.findByIdAndUpdate(deliveryId, update, { new: true });
};

export const updateLocation = async (deliveryId: string, location: { lat: number, lng: number }) => {
  return await Delivery.findByIdAndUpdate(deliveryId, { location }, { new: true });
};

export const getDeliveryById = async (deliveryId: string) => {
  return await Delivery.findById(deliveryId);
};

export const getDeliveryByDriver = async (driverId: string) => {
  return await Delivery.findOne({ deliveryPersonId: driverId, status: { $ne: 'Delivered' } });
};
