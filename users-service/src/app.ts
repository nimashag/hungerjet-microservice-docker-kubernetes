
import express from 'express';
import authRoutes from './routes/users.routes';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;