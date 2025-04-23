import { Router } from 'express';
import * as ctrl from '../controllers/orders.controller';
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize";

const router = Router();

router.post('/', authenticate, authorizeRoles("customer"), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.put('/:id', authenticate, authorizeRoles("customer"), ctrl.update);
router.delete('/:id', authenticate, authorizeRoles("customer"), ctrl.deleteOrder);
// router.get('/:id', OrdersController.getById);
// router.put('/:id', OrdersController.update);
// router.delete('/:id', OrdersController.delete);
// router.patch('/:id/status', OrdersController.updateStatus);

export default router;