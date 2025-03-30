import express from "express";
import { auth, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../models/types";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} from "../controllers/event.controller";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvent);

// Protected routes
router.post("/", auth, requireRole([UserRole.EVENT_COORDINATOR, UserRole.ADMIN]), createEvent);
router.put("/:id", auth, requireRole([UserRole.EVENT_COORDINATOR, UserRole.ADMIN]), updateEvent);
router.delete("/:id", auth, requireRole([UserRole.EVENT_COORDINATOR, UserRole.ADMIN]), deleteEvent);
router.post("/:id/register", auth, registerForEvent);

export default router;
