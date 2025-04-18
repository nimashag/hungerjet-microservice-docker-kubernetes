import express from 'express';
import mongoose from 'mongoose';
import orderRoutes from './routes/orders.routes';

const app = express();
app.use(express.json());

app.use('/api/orders', orderRoutes);

export default app;
