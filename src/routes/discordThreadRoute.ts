import { Router } from "express";
import {
  getMessages,
  getThreadTickets,
  resolveThread,
  sendMessages,
} from "../controllers/discordThreadController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router
  .route("/message/:id")
  .get(protect, getMessages)
  .post(protect, sendMessages);
router.post("/resolve/:id", protect, resolveThread);
router.get("/tickets", protect, getThreadTickets);

module.exports = router;
