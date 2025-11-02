import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.get("/quotations/:id/export", async (req, res) => {
  try {
    const id = req.params.id;
    // Fetch your quotation data (mock example)
    const quotation = { id, name: "Test Customer", amount: 1200, date: new Date() };

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=quotation-${id}.pdf`);

    doc.pipe(res);
    doc.fontSize(18).text("Quotation Details", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Customer: ${quotation.name}`);
    doc.text(`Amount: ₹${quotation.amount}`);
    doc.text(`Date: ${quotation.date.toLocaleDateString()}`);
    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
