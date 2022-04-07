import { Router } from "express";
import {
  deleteMe,
  getMe,
  loginUser,
  registerUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.delete("/me", protect, deleteMe);

module.exports = router;
