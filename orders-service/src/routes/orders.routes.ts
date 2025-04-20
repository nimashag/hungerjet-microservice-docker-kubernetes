import { Router } from 'express';
import OrdersController from '../controllers/orders.controller';

const router = Router();

router.post('/', OrdersController.create);
router.get('/', OrdersController.getAll);
router.get('/:id', OrdersController.getById);
router.put('/:id', OrdersController.update);
router.delete('/:id', OrdersController.delete);
router.patch('/:id/status', OrdersController.updateStatus);

export default router;