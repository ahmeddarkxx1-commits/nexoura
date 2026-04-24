// using node --env-file=.env.local
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const email = 'admin@nexoura.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await usersCollection.findOne({ email });

    if (existingAdmin) {
      await usersCollection.updateOne({ email }, { $set: { password: hashedPassword, role: 'admin' } });
      console.log('Admin user updated:', email, password);
    } else {
      await usersCollection.insertOne({
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Admin user created:', email, password);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
