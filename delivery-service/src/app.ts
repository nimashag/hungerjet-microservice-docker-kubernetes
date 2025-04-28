import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import deliveryRoutes from './routes/delivery.routes';
import driverRoutes from './routes/driver.routes';

const app = express();
//Allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json());

app.use('/api/drivers', driverRoutes);
app.use('/api/delivery',deliveryRoutes);


export default app;
