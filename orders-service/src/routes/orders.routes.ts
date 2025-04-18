import { Router } from 'express';
import OrdersController from '../controllers/orders.controller';

const router = Router();

router.post('/', OrdersController.create);
router.get('/', OrdersController.getAll);
router.get('/:id', OrdersController.getById);
router.put('/:id', OrdersController.update);
router.delete('/:id', OrdersController.delete);

export default router;
