import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import passwordRoutes from './routes/passwords.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = { origin: true, credentials: true };
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vaulty';
mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/passwords', passwordRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

