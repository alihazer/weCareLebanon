// src/app.js

import express from 'express';
import path from 'path';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectToDatabase from './config/database.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import webRoutes from './routes/web.routes.js';
import productsRoutes from './routes/products.routes.js';
import categoryRoutes from './routes/category.routes.js';

dotenv.config();


// Convert ES Module file URL to path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

connectToDatabase();

// Middlewares
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.json());


// EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', webRoutes);


// Error handling middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
