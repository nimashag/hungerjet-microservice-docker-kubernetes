import { Router } from 'express';
import * as ctrl from '../controllers/orders.controller';
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize";

const router = Router();

router.post('/', authenticate, authorizeRoles("customer"), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/restaurant/:restaurantId', ctrl.getByRestaurantId);
router.get('/:id', ctrl.getOne);
router.put('/:id', authenticate, authorizeRoles("customer"), ctrl.update);
router.delete('/:id', authenticate, authorizeRoles("customer"), ctrl.deleteOrder);

export default router;