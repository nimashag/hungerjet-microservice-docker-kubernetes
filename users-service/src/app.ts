import express from 'express';
import mongoose from 'mongoose';
//import users from './routes/users.routes'; // just example

const app = express();
app.use(express.json());

//app.use('/api/users', users); // just example. You need to write route file 

export default app;
