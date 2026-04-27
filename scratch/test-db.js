
const mongoose = require('mongoose');
const uri = "mongodb+srv://conferaUser:HLcFao9fOd7AuXk4@cluster0.zbhc5y5.mongodb.net/conferaai?retryWrites=true&w=majority";

async function testConnection() {
  console.log('Testing MongoDB connection...');
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed!');
    console.error(err);
    process.exit(1);
  }
}

testConnection();
