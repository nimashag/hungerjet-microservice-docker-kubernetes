import express from 'express';
import mongoose from 'mongoose';
import restaurantsRoutes from './routes/restaurants.routes';

const app = express();
app.use(express.json());

app.use('/api/restaurants', restaurantsRoutes);

export default app;
