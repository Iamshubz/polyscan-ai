require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/polyscan-ai';
    console.log('[Seed] Connecting to MongoDB:', mongoUri);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected.');

    // Seed Demo User
    const existingDemo = await User.findOne({ email: 'demo@polyscan.ai' });
    if (!existingDemo) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      await User.create({
        name: 'Demo Eco User',
        email: 'demo@polyscan.ai',
        passwordHash,
      });
      console.log('[Seed] Demo user created: demo@polyscan.ai / password123');
    } else {
      console.log('[Seed] Demo user already exists.');
    }

    console.log('[Seed] Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();
