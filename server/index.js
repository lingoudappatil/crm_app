import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import User from './models/User.js';
import Lead from './models/Leads.js';  // Corrected import (use Lead instead of Leads)
import Customer from './models/Customer.js';
import Quotation from './models/Quotation.js';
import Order from './models/Order.js';
import followUpRoutes from "./routes/followUps.js";
// Initialize app
const app = express();






import dotenv from 'dotenv';
dotenv.config();                   // load .env first
import connectDB from './config/db.js';  // ES module import


// connect DB
connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB connect error', err));

app.use(express.json());









// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/followups", followUpRoutes);
// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, address, state, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      address,
      state,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Lead Routes
app.post('/api/leads', async (req, res) => {
  try {
    console.log('Received lead data:', req.body);
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ message: 'Lead added successfully!', lead: newLead });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to add lead', details: error.message });
  }
});
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Customer Routes
app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully!', customer: newCustomer });
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Failed to add customer', details: error.message });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Quotation Routes
app.post('/api/quotations', async (req, res) => {
  try {
    const newQuotation = new Quotation(req.body);
    await newQuotation.save();
    res.status(201).json({ message: 'Quotation added successfully!', quotation: newQuotation });
  } catch (error) {
    console.error('Error saving quotation:', error);
    res.status(500).json({ error: 'Failed to add quotation', details: error.message });
  }
});

app.get('/api/quotations', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order added successfully!', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to add order', details: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Backend Server is running successfully!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));