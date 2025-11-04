// =================== IMPORTS ===================
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

// Models
import User from "./models/User.js";
import Lead from "./models/Leads.js";
import Customer from "./models/Customer.js";
import Quotation from "./models/Quotation.js";
import Order from "./models/Order.js";
import settingsRoutes from "./routes/settings.js";

// Routes
import followUpRoutes from "./routes/followUps.js";
import quotationRoutes from "./routes/quotationRoutes.js";


// Config
import connectDB from "./config/db.js";

// =================== INITIAL SETUP ===================
const app = express();
dotenv.config();

// Connect MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connect error", err));

// =================== MIDDLEWARE ===================
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// =================== API ROUTES ===================

// Follow-up & quotation routes (from routes folder)
app.use("/api/followups", followUpRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/settings", settingsRoutes);

// =================== USER ROUTES ===================

// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, address, state, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, address, state, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =================== LEAD ROUTES ===================
app.post("/api/leads", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ message: "Lead added successfully!", lead: newLead });
  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ error: "Failed to add lead" });
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// =================== CUSTOMER ROUTES ===================
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

// =================== QUOTATION ROUTES ===================

// Create quotation
app.post("/api/quotations", async (req, res) => {
  try {
    const newQuotation = new Quotation(req.body);
    await newQuotation.save();
    res.status(201).json({ message: "Quotation added successfully!", quotation: newQuotation });
  } catch (error) {
    console.error("Error saving quotation:", error);
    res.status(500).json({ error: "Failed to add quotation" });
  }
});

// Get all quotations
app.get("/api/quotations", async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ error: "Failed to fetch quotations" });
  }
});

// Update quotation
app.put("/api/quotations/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.json({ message: "Quotation updated successfully", quotation });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res.status(500).json({ error: "Failed to update quotation" });
  }
});

// ✅ Export quotation as PDF (FIXED)
app.get("/api/quotations/:id/export", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ error: "Quotation not found" });

    // Create PDF document
    const doc = new PDFDocument();

    // Set headers for browser download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quotation-${quotation._id}.pdf`
    );

    // Pipe PDF data to response
    doc.pipe(res);

    // Add PDF content
    doc.fontSize(20).text("Quotation", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Quotation No: ${quotation._id}`);
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`).moveDown();

    doc.fontSize(14).text("Customer Details");
    doc.fontSize(12)
      .text(`Name: ${quotation.name}`)
      .text(`Email: ${quotation.email}`)
      .text(`Phone: ${quotation.phone}`)
      .text(`Address: ${quotation.address}`)
      .moveDown();

    doc.fontSize(14).text("Item Details");
    doc.fontSize(12)
      .text(`Item: ${quotation.item}`)
      .text(`Quantity: ${quotation.quantity}`)
      .text(`Amount: ₹${quotation.amount}`)
      .moveDown();

    doc.fontSize(14).text(`Total: ₹${quotation.amount}`, { align: "right" });
    doc.end(); // Finalize the PDF
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// =================== ORDER ROUTES ===================
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order added successfully!", order: newOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to add order" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// =================== FRONTEND DEPLOYMENT (MOVE TO END) ===================
// ✅ Keep this block at the BOTTOM of the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build files
app.use(express.static(path.join(__dirname, "./client/build")));

// All other routes -> return React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// =================== START SERVER ===================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
