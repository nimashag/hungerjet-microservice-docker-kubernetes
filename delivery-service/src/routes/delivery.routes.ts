import express from 'express';
import * as DeliveryController from '../controllers/delivery.controller';

const router = express.Router();

// Static/specific routes first
router.post('/create', DeliveryController.createDelivery);
router.patch('/:id/assign', DeliveryController.assignDriver);
router.patch('/:id/accept', DeliveryController.acceptDelivery); // have to add authmiddleware to this
router.patch('/:id/status', DeliveryController.updateStatus);
router.patch('/:id/location', DeliveryController.updateDeliveryLocation);

// Specific before dynamic
router.get('/driver/:driverId/active', DeliveryController.getActiveDeliveryForDriver);

// Place this LAST
router.get('/:id', DeliveryController.getDeliveryById);

export default router;
