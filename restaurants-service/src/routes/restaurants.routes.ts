import express from 'express';
import * as ctrl from '../controllers/restaurants.controller';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.post('/', upload.single('image'), ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/availability', ctrl.toggleAvailability);
router.put('/:id', upload.single('image'), ctrl.update);

router.post('/:id/menu-items', upload.single('image'), ctrl.addMenuItem);
router.get('/:id/menu-items', ctrl.listMenuItems);
router.get("/:id/menu-items/:itemId", ctrl.getOneMenuItem);
router.put('/:id/menu-items/:itemId', upload.single('image'), ctrl.updateMenuItem);
router.delete('/:id/menu-items/:itemId', ctrl.deleteMenuItem);


export default router;
