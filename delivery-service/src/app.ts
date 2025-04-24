import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import deliveryRoutes from './routes/delivery.routes';

const app = express();
app.use(express.json());


app.use('/api/delivery',deliveryRoutes);

export default app;
