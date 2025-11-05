import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { allProducts } from './data.js';

const app = express();
const PORT = 5000;
const DB_FILE = './db.json';

// JWT Secrets
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Helper Functions ---
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const initialData = {
      users: [],
      refreshTokens: [],
      carts: [],
      orders: [],
      products: allProducts
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

// --- Authentication Middleware ---
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // IMPORTANT: Fetch fresh user data from database to get current role
    const dbData = await readDB();
    const currentUser = dbData.users.find(u => u.id === decoded.id);
    
    if (!currentUser) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    // Use current role from database, not from token
    req.user = {
      ...decoded,
      role: currentUser.role || 'user'  // Always get fresh role from DB
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', expired: true });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Admin Middleware
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// --- API Routes ---

app.get('/', (req, res) => {
  res.send('UrbanKart Backend API - All Systems Active 🚀');
});

// ==================== AUTHENTICATION ROUTES ====================

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const dbData = await readDB();
    
    const userExists = dbData.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    dbData.users.push(newUser);
    
    // Initialize empty cart for new user
    dbData.carts.push({
      userId: newUser.id,
      items: []
    });
    
    await writeDB(dbData);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    dbData.refreshTokens.push({
      userId: newUser.id,
      token: refreshToken,
      createdAt: new Date().toISOString()
    });
    await writeDB(dbData);

    console.log('✅ New user signed up:', newUser.email);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const dbData = await readDB();
    
    const user = dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    dbData.refreshTokens.push({
      userId: user.id,
      token: refreshToken,
      createdAt: new Date().toISOString()
    });
    await writeDB(dbData);

    console.log('✅ User logged in:', user.email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const dbData = await readDB();

    const tokenExists = dbData.refreshTokens.find(t => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = dbData.users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Refresh token expired. Please login again' });
    }
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const dbData = await readDB();
    dbData.refreshTokens = dbData.refreshTokens.filter(t => t.token !== refreshToken);
    await writeDB(dbData);

    console.log('✅ User logged out:', req.user.email);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const dbData = await readDB();
    const user = dbData.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PRODUCT ROUTES ====================

app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured, minPrice, maxPrice } = req.query;
    const dbData = await readDB();
    let products = dbData.products || allProducts;

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const dbData = await readDB();
    const products = dbData.products || allProducts;
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== CART ROUTES ====================

app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const dbData = await readDB();
    let userCart = dbData.carts.find(cart => cart.userId === req.user.id);

    if (!userCart) {
      userCart = { userId: req.user.id, items: [] };
      dbData.carts.push(userCart);
      await writeDB(dbData);
    }

    res.json({ items: userCart.items });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const dbData = await readDB();
    const products = dbData.products || allProducts;
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let userCart = dbData.carts.find(cart => cart.userId === req.user.id);
    
    if (!userCart) {
      userCart = { userId: req.user.id, items: [] };
      dbData.carts.push(userCart);
    }

    const existingItem = userCart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    await writeDB(dbData);

    console.log(`✅ Added to cart: ${product.name} for user ${req.user.email}`);
    res.json({ message: 'Item added to cart', cart: userCart.items });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/cart/update', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  if (quantity < 0) {
    return res.status(400).json({ message: 'Quantity cannot be negative' });
  }

  try {
    const dbData = await readDB();
    const userCart = dbData.carts.find(cart => cart.userId === req.user.id);

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity === 0) {
      userCart.items = userCart.items.filter(item => item.productId !== productId);
    } else {
      const item = userCart.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      } else {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
    }

    await writeDB(dbData);

    res.json({ message: 'Cart updated', cart: userCart.items });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart/remove/:productId', authenticateToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const dbData = await readDB();
    const userCart = dbData.carts.find(cart => cart.userId === req.user.id);

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    userCart.items = userCart.items.filter(item => item.productId !== productId);
    await writeDB(dbData);

    console.log(`✅ Removed from cart: ${productId} for user ${req.user.email}`);
    res.json({ message: 'Item removed from cart', cart: userCart.items });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart/clear', authenticateToken, async (req, res) => {
  try {
    const dbData = await readDB();
    const userCart = dbData.carts.find(cart => cart.userId === req.user.id);

    if (userCart) {
      userCart.items = [];
      await writeDB(dbData);
    }

    console.log(`✅ Cart cleared for user ${req.user.email}`);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ORDER ROUTES ====================

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ message: 'Shipping address and payment method are required' });
  }

  try {
    const dbData = await readDB();

    const order = {
      id: `ORD-${Date.now()}`,
      userId: req.user.id,
      items: items,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      totalAmount: totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dbData.orders.push(order);

    // Clear user's cart after order
    const userCart = dbData.carts.find(cart => cart.userId === req.user.id);
    if (userCart) {
      userCart.items = [];
    }

    await writeDB(dbData);

    console.log(`✅ Order created: ${order.id} for user ${req.user.email}`);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const dbData = await readDB();
    const userOrders = dbData.orders.filter(order => order.userId === req.user.id);

    res.json(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const dbData = await readDB();
    const order = dbData.orders.find(o => o.id === req.params.id && o.userId === req.user.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all orders (Admin only)
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const dbData = await readDB();
    res.json(dbData.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
app.put('/api/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    const dbData = await readDB();
    const order = dbData.orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    await writeDB(dbData);

    console.log(`✅ Order updated: ${order.id}`);
    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product (Admin only)
app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, category, image, description, featured } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  try {
    const dbData = await readDB();

    const newProduct = {
      id: `p${Date.now()}`,
      name,
      price: Number(price),
      category,
      image: image || 'https://placehold.co/600x600',
      description: description || '',
      featured: featured || false,
      reviews: []
    };

    dbData.products.push(newProduct);
    await writeDB(dbData);

    console.log(`✅ Product added: ${newProduct.name}`);
    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
app.put('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, category, image, description, featured } = req.body;

  try {
    const dbData = await readDB();
    const productIndex = dbData.products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = dbData.products[productIndex];
    
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (image) product.image = image;
    if (description !== undefined) product.description = description;
    if (featured !== undefined) product.featured = featured;

    await writeDB(dbData);

    console.log(`✅ Product updated: ${product.name}`);
    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
app.delete('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const dbData = await readDB();
    const productIndex = dbData.products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = dbData.products.splice(productIndex, 1)[0];
    await writeDB(dbData);

    console.log(`✅ Product deleted: ${deletedProduct.name}`);
    res.json({ message: 'Product deleted', product: deletedProduct });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const dbData = await readDB();
    const users = dbData.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== REVIEW ROUTES ====================

// Add review to product
app.post('/api/products/:id/reviews', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Review comment is required' });
  }

  try {
    const dbData = await readDB();
    const productIndex = dbData.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = dbData.products[productIndex];

    // Check if user already reviewed this product
    const existingReview = product.reviews?.find(r => r.userId === req.user.id);
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Add review
    const newReview = {
      id: Date.now().toString(),
      userId: req.user.id,
      author: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date().toISOString()
    };

    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(newReview);

    await writeDB(dbData);

    console.log(`✅ Review added to product ${productId} by ${req.user.email}`);
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product reviews
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const dbData = await readDB();
    const product = dbData.products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.reviews || []);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review (user can only delete their own)
app.delete('/api/products/:productId/reviews/:reviewId', authenticateToken, async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    const dbData = await readDB();
    const productIndex = dbData.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = dbData.products[productIndex];
    const reviewIndex = product.reviews?.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1 || reviewIndex === undefined) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = product.reviews[reviewIndex];

    // Check if user owns this review or is admin
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    product.reviews.splice(reviewIndex, 1);
    await writeDB(dbData);

    console.log(`✅ Review deleted from product ${productId}`);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Authentication system active`);
  console.log(`✅ Cart system active`);
  console.log(`✅ Order system active`);
  console.log(`✅ Admin panel active`);
});