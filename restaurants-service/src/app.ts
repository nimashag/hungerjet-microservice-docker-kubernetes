import express from 'express';
import mongoose from 'mongoose';
import restaurantsRoutes from './routes/restaurants.routes';
import menuItemsRoutes from './routes/menuItems.routes';

const app = express();
app.use(express.json());

app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/restaurants', menuItemsRoutes);


export default app;
