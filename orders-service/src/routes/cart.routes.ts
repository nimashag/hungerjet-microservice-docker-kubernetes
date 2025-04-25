import express from 'express';
import * as CartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/item/:itemId', CartController.updateItemQuantity);
router.delete('/item/:itemId', CartController.removeItem);
router.delete('/', CartController.clearCart);
router.post('/checkout', CartController.checkout);

export default router;