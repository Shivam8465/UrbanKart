// backend/migrate.js
import fs from 'fs/promises';
import { connectDB, COLLECTIONS, closeDB } from './db.js';
import { allProducts } from './data.js';

const DB_FILE = './db.json';

async function migrate() {
  try {
    console.log('🚀 Starting migration...');

    let jsonData;
    try {
      const data = await fs.readFile(DB_FILE, 'utf-8');
      jsonData = JSON.parse(data);
      console.log('✅ Read db.json successfully');
    } catch (error) {
      console.log('⚠️ No db.json found, starting with empty data');
      jsonData = {
        users: [],
        refreshTokens: [],
        carts: [],
        orders: [],
        products: allProducts
      };
    }

    const db = await connectDB();

    if (jsonData.users && jsonData.users.length > 0) {
      await db.collection(COLLECTIONS.USERS).deleteMany({});
      await db.collection(COLLECTIONS.USERS).insertMany(jsonData.users);
      console.log(`✅ Migrated ${jsonData.users.length} users`);
    } else {
      console.log('⚠️ No users to migrate');
    }

    if (jsonData.refreshTokens && jsonData.refreshTokens.length > 0) {
      await db.collection(COLLECTIONS.REFRESH_TOKENS).deleteMany({});
      await db.collection(COLLECTIONS.REFRESH_TOKENS).insertMany(jsonData.refreshTokens);
      console.log(`✅ Migrated ${jsonData.refreshTokens.length} refresh tokens`);
    }

    if (jsonData.carts && jsonData.carts.length > 0) {
      await db.collection(COLLECTIONS.CARTS).deleteMany({});
      await db.collection(COLLECTIONS.CARTS).insertMany(jsonData.carts);
      console.log(`✅ Migrated ${jsonData.carts.length} carts`);
    }

    if (jsonData.orders && jsonData.orders.length > 0) {
      await db.collection(COLLECTIONS.ORDERS).deleteMany({});
      await db.collection(COLLECTIONS.ORDERS).insertMany(jsonData.orders);
      console.log(`✅ Migrated ${jsonData.orders.length} orders`);
    }

    const products = jsonData.products || allProducts;
    if (products && products.length > 0) {
      await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
      await db.collection(COLLECTIONS.PRODUCTS).insertMany(products);
      console.log(`✅ Migrated ${products.length} products`);
    }

    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTIONS.PRODUCTS).createIndex({ category: 1 });
    await db.collection(COLLECTIONS.ORDERS).createIndex({ userId: 1 });
    await db.collection(COLLECTIONS.CARTS).createIndex({ userId: 1 });
    console.log('✅ Created database indexes');

    const backupFile = `./db.json.backup.${Date.now()}`;
    try {
      await fs.copyFile(DB_FILE, backupFile);
      console.log(`✅ Created backup: ${backupFile}`);
    } catch (e) {
      console.log('⚠️ No db.json to backup (that\'s ok!)');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('✨ You can now start the server with MongoDB');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await closeDB();
  }
}

migrate();