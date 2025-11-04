// server/routes/settings.js
import express from "express";

const router = express.Router();

// Temporary in-memory storage (you can later connect MongoDB/MySQL)
let leadSources = ["Friend", "Walk In", "Social Media", "Other"];

// 🧩 Get all sources
router.get("/lead-sources", (req, res) => {
  res.json({ sources: leadSources });
});

// ➕ Add a new source
router.post("/lead-sources", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (leadSources.includes(name))
    return res.status(400).json({ error: "Source already exists" });
  leadSources.push(name);
  res.json({ message: "Source added successfully", sources: leadSources });
});

// ❌ Delete a source
router.delete("/lead-sources/:name", (req, res) => {
  const { name } = req.params;
  leadSources = leadSources.filter((src) => src !== name);
  res.json({ message: "Source removed", sources: leadSources });
});

export default router;
