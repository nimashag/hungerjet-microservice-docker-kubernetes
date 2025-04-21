import express from 'express';
import mongoose from 'mongoose';
import restaurantsRoutes from './routes/restaurants.routes';
import path from 'path';

const app = express();
app.use(express.json());

app.use('/api/restaurants', restaurantsRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


export default app;
