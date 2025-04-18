import express from 'express';
import * as ctrl from '../controllers/menuItems.controller';

const router = express.Router();

router.post('/:id/menu-items', ctrl.addMenuItem);
router.get('/:id/menu-items', ctrl.listMenuItems);
router.put('/menu-items/:itemId', ctrl.updateMenuItem);
router.delete('/menu-items/:itemId', ctrl.deleteMenuItem);

export default router;