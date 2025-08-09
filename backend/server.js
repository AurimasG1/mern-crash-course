import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use((req, res, next) => {
	console.log(`Incoming request: ${req.method} ${req.path}`);
	next();
});
app.use('/api/products', productRoutes);

if (process.env.NODE_ENV === 'production') {
	// Serve frontend static files
	app.use(express.static(path.join(__dirname, '/frontend/dist')));

	// ALL other requests server frontend
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
	});
} else {
	// in Development, just show a simple message on root
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at http://localhost:${PORT}`);
});
