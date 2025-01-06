// src/app.js

import express from 'express';
import path from 'path';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectToDatabase from './config/database.js';

dotenv.config();


// Convert ES Module file URL to path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

connectToDatabase();

// Middlewares
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Error handling middlewares

export default app;
