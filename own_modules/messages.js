import express from "express";
const router = express.Router();

import { findMessages } from "./dbcrud.js";

router.get("/:skip/:limit", (req, res) => {
    const { skip, limit } = req.params;
    findMessages(skip, limit, (err, doc) =>
        err ? res.status(500).json({ err: err.message }) : res.json(doc)
    );
});

export default router;
