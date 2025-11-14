// backend/db.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'urbankart';

let client = null;
let db = null;

export async function connectDB() {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔒 MongoDB connection closed');
  }
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  REFRESH_TOKENS: 'refreshTokens',
  CARTS: 'carts',
  ORDERS: 'orders',
  PRODUCTS: 'products'
};