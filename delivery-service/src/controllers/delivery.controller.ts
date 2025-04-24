import { Request, Response } from 'express';
import * as DeliveryService from '../services/delivery.service';

export const createDelivery = async (req: Request, res: Response) => {
  const delivery = await DeliveryService.createDelivery(req.body);
  res.status(201).json(delivery);
};

export const assignDriver = async (req: Request, res: Response) => {
  const result = await DeliveryService.assignDriver(req.params.id);
  res.status(200).json(result);
};

export const acceptDelivery = async (req: Request, res: Response) => {
  const result = await DeliveryService.acceptDelivery(req.params.id, req.body.driverId);
  res.status(200).json(result);
};

export const updateStatus = async (req: Request, res: Response) => {
  const result = await DeliveryService.updateStatus(req.params.id, req.body.status);
  res.status(200).json(result);
};

export const updateDeliveryLocation = async (req: Request, res: Response) => {
  const result = await DeliveryService.updateLocation(req.params.id, req.body.location);
  res.status(200).json(result);
};

export const getDeliveryById = async (req: Request, res: Response) => {
  const delivery = await DeliveryService.getDeliveryById(req.params.id);
  res.status(200).json(delivery);
};

export const getActiveDeliveryForDriver = async (req: Request, res: Response) => {
  const delivery = await DeliveryService.getDeliveryByDriver(req.params.driverId);
  res.status(200).json(delivery);
};
