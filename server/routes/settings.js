import express from "express";
import Setting from "../models/Setting.js";

const router = express.Router();

// 🧩 Get values by type (e.g. leadSource)
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    let setting = await Setting.findOne({ type });

    if (!setting) {
      setting = await Setting.create({ type, values: [] });
    }

    res.json({ values: setting.values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add new value to a dropdown
router.post("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { name } = req.body;

    let setting = await Setting.findOne({ type });
    if (!setting) setting = await Setting.create({ type, values: [] });

    if (setting.values.includes(name))
      return res.status(400).json({ error: "Value already exists" });

    setting.values.push(name);
    await setting.save();

    res.json({ message: "Added successfully", values: setting.values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete a value
router.delete("/:type/:name", async (req, res) => {
  try {
    const { type, name } = req.params;

    const setting = await Setting.findOne({ type });
    if (!setting) return res.status(404).json({ error: "Type not found" });

    setting.values = setting.values.filter((v) => v !== name);
    await setting.save();

    res.json({ message: "Deleted successfully", values: setting.values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
