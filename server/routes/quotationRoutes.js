import express from "express";
import PDFDocument from "pdfkit";
import Quotation from "../models/Quotation.js";

const router = express.Router();

/**
 * ✅ Add New Quotation
 */
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      state,
      items,
      totalAmount,
      customFields,
    } = req.body;

    // Validate required fields
    if (!customerName?.trim()) {
      return res.status(400).json({ error: "Customer name is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    // Validate items
    const validItems = items.every(item => 
      item.itemName?.trim() && 
      typeof item.qty === 'number' && item.qty > 0 &&
      typeof item.price === 'number' && item.price >= 0
    );

    if (!validItems) {
      return res.status(400).json({ 
        error: "Each item must have a name, quantity greater than 0, and valid price" 
      });
    }

    // Convert totalAmount to number if it's a string
    const parsedTotalAmount = typeof totalAmount === 'string' 
      ? parseFloat(totalAmount) 
      : totalAmount;

    if (isNaN(parsedTotalAmount) || parsedTotalAmount < 0) {
      return res.status(400).json({ error: "Valid total amount is required" });
    }

    // Create and save quotation
    const newQuotation = new Quotation({
      customerName: customerName.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      state: state?.trim(),
      items: items.map(item => ({
        ...item,
        itemName: item.itemName.trim(),
        qty: parseFloat(item.qty),
        price: parseFloat(item.price),
        discount: parseFloat(item.discount || 0),
        tax: parseFloat(item.tax || 0),
        subtotal: parseFloat(item.subtotal || 0)
      })),
      totalAmount: parsedTotalAmount,
      customFields
    });

    // Attempt to save
    await newQuotation.save();

    // Return success response
    res.status(201).json({ 
      message: "Quotation added successfully!", 
      quotation: newQuotation 
    });

  } catch (error) {
    // Log detailed error for debugging
    console.error("❌ Error saving quotation:", {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    // Send appropriate error message
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error: " + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({ 
      error: "Failed to add quotation: " + error.message
    });
  }
});

/**
 * ✅ Get All Quotations
 */
router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error("❌ Error fetching quotations:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ Export Quotation as PDF
 */
router.get("/:id/export", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation)
      return res.status(404).json({ error: "Quotation not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quotation-${quotation.quotationNumber}.pdf`
    );

    doc.pipe(res);
    doc.fontSize(20).text("Quotation", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Quotation No: ${quotation.quotationNumber}`);
    doc.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`).moveDown();

    doc.fontSize(14).text("Customer Details").moveDown();
    doc.fontSize(12)
      .text(`Name: ${quotation.customerName}`)
      .text(`Email: ${quotation.email}`)
      .text(`Phone: ${quotation.phone}`)
      .text(`Address: ${quotation.address}`)
      .text(`State: ${quotation.state}`)
      .moveDown();

    doc.fontSize(14).text("Items").moveDown();
    quotation.items.forEach((item, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${item.itemName}`)
        .text(`Qty: ${item.qty}, Price: ₹${item.price}, Subtotal: ₹${item.subtotal}`)
        .moveDown();
    });

    doc.fontSize(14).text(`Total Amount: ₹${quotation.totalAmount}`, {
      align: "right",
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
