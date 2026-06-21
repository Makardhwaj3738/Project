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

    // Remove stale lock file left by a previous mongod process (e.g. from nodemon restart)
    const lockFile = path.join(dbPath, 'mongod.lock');
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
      console.log('Removed stale mongod.lock file');
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
      
      // Seed all demo users on startup (upsert — always ensure they exist with correct password)
      const demoUsers = [
        { name: 'Test User',      email: 'test@example.com'  },
        { name: 'Alice Traveler', email: 'alice@example.com' },
        { name: 'Bob Explorer',   email: 'bob@example.com'   },
      ];

      for (const demo of demoUsers) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        const existing = await User.findOne({ email: demo.email });
        if (!existing) {
          await User.create({ name: demo.name, email: demo.email, passwordHash });
          console.log(`Demo user created: ${demo.email} / password123`);
        } else {
          existing.passwordHash = passwordHash;
          await existing.save();
          console.log(`Demo user password reset: ${demo.email} / password123`);
        }
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
