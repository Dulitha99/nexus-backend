import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js"; // Corrected getMessage to getMessages
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); // Corrected getMessage to getMessages
router.post("/send/:id", protectRoute, sendMessage);

export default router;
