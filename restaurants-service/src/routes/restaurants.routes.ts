import express from 'express';
import * as ctrl from '../controllers/restaurants.controller';

const router = express.Router();

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/availability', ctrl.toggleAvailability);


export default router;
