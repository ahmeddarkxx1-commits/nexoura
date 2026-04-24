const mongoose = require('mongoose');
// require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function test() {
  console.log("Testing connection to:", uri.split('@')[1]); // Don't log password
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Could not connect to MongoDB");
    console.error("Error Code:", err.code);
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    process.exit(1);
  }
}

test();
