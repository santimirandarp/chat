import express from "express";
const router = express.Router();

import { findMessages } from "./dbcrud.js";

router.get("/:skip/:limit", async (req, res) => {
  const { skip, limit } = req.params;
  try {
    const doc = await findMessages(skip, limit);
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ err: e.message });
  }
});

export default router;
