import express from 'express';
import * as ctrl from '../controllers/restaurants.controller';

const router = express.Router();

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/availability', ctrl.toggleAvailability);
router.post('/:id/menu-items', ctrl.addMenuItem);
router.get('/:id/menu-items', ctrl.listMenuItems);
router.put('/menu-items/:itemId', ctrl.updateMenuItem);
router.delete('/menu-items/:itemId', ctrl.deleteMenuItem);

export default router;
