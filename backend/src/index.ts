import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import tripRoutes from './routes/trip';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User';
import bcrypt from 'bcrypt';

const startServer = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri === 'mongodb://localhost:27017/ai-travel-planner') {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, '../../local-mongo-db');
    
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
        storageEngine: 'wiredTiger'
      }
    });
    mongoUri = mongoServer.getUri();
    console.log(`Using persistent local MongoDB at ${dbPath}`);
  }

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log('Connected to MongoDB at', mongoUri);
      
      // Seed default user
      const defaultEmail = 'test@example.com';
      const existingUser = await User.findOne({ email: defaultEmail });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        await User.create({
          name: 'Test User',
          email: defaultEmail,
          passwordHash
        });
        console.log(`Default user created: ${defaultEmail} / password123`);
      }

      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
};

startServer();
