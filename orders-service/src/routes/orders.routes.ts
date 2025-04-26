import { Router } from 'express';
import * as ctrl from '../controllers/orders.controller';
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize";

const router = Router();

router.post('/', authenticate, authorizeRoles("customer"), ctrl.create);
router.get('/:id', authenticate, authorizeRoles("customer"), ctrl.getOne);
router.get('/', authenticate, authorizeRoles("customer"), ctrl.getAll);
router.get('/restaurant/:restaurantId', authenticate, authorizeRoles("customer"), ctrl.getByRestaurantId);
router.patch("/:id/delivery-address", authenticate, authorizeRoles("customer"), ctrl.updateDeliveryAddress);
router.patch("/:id/special-instructions", authenticate, authorizeRoles("customer"), ctrl.updateSpecialInstructions);
router.delete('/:id', authenticate, authorizeRoles("customer"), ctrl.deleteOrder);

router.put('/:id', authenticate, authorizeRoles("customer"), ctrl.update);

// Get current user's orders
router.get('/user/current', authenticate, ctrl.getCurrentUserOrders);

// Get orders for restaurant admin's restaurant
//router.get('/restaurant/current', authenticate, authorizeRoles("restaurantAdmin"), ctrl.getRestaurantOrders);

// Update just the order status
router.patch('/:id/status', authenticate, authorizeRoles("admin", "restaurantAdmin"), ctrl.updateOrderStatus);

export default router;