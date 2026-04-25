const mongoose = require('mongoose');
const uri = "mongodb://ahmeddarkxx1_db_user:y3gufPqQbWVJEJeW@ac-ff1db1c-shard-00-00.wkggusd.mongodb.net:27017,ac-ff1db1c-shard-00-01.wkggusd.mongodb.net:27017,ac-ff1db1c-shard-00-02.wkggusd.mongodb.net:27017/nexoura?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function count() {
  await mongoose.connect(uri);
  const products = await mongoose.connection.db.collection('products').find({}).toArray();
  const plans = await mongoose.connection.db.collection('plans').find({}).toArray();
  
  console.log('--- PRODUCTS ---');
  products.forEach(p => console.log(`- ${p.title} (${p._id})`));
  console.log('--- PLANS ---');
  plans.forEach(p => console.log(`- ${p.name} (${p._id})`));
  
  await mongoose.disconnect();
}

count();
