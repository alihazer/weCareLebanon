// src/app.js

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import connectToDatabase from './config/database.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productsRoutes from './routes/products.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import customerRoutes from './routes/customer.routes.js';
import usersRoutes from './routes/user.routes.js';
import invoices from './routes/invouce.routes.js';
import webRoutes from './routes/web.routes.js';
import { isLoggedIn } from './middlewares/isLoggedIn.js';
import statisticsRoutes from './routes/statistics.routes.js';
import costsRoutes from './routes/cost.routes.js';

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
app.use(expressLayouts);


// EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// set the public folder, the public is outside the src folder
app.use(express.static(path.join(__dirname, '../public')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/invoice', invoices);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/costs', costsRoutes);

app.use('/', webRoutes);



// Error handling middlewares
app.use(isLoggedIn ,notFoundHandler);
app.use(isLoggedIn ,globalErrorHandler);

export default app;
