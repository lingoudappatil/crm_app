// =================== IMPORTS ===================
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Models
import User from "./models/User.js";
import Lead from "./models/Leads.js";
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";

// Routes
import followUpRoutes from "./routes/followUps.js";
import quotationRoutes from "./routes/quotationRoutes.js";

// Config
import connectDB from "./config/db.js";

const app = express();
dotenv.config();

// Connect MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connect error", err));

// =================== MIDDLEWARE ===================
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// =================== AUTH ROUTES ===================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    console.log("🔍 Login attempt for:", email);

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ error: "User not found" });
    }

    // Simple password check (use bcrypt in production)
    if (user.password !== password) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ error: "Invalid password" });
    }

    console.log("✅ Login successful for:", email);

    res.json({ 
      message: "Login successful",
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role || "user"
      } 
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed - Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ 
      message: "Registration successful",
      user: { id: newUser._id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// =================== ROUTES ===================
app.use("/api/followups", followUpRoutes);
app.use("/api/quotations", quotationRoutes);

// ✅ Customers
app.post("/api/customers", async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: "Customer added successfully!", customer: newCustomer });
  } catch (error) {
    console.error("Error saving customer:", error);
    res.status(500).json({ error: "Failed to add customer" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// =================== FRONTEND DEPLOYMENT ===================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// =================== ERROR HANDLING ===================
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));