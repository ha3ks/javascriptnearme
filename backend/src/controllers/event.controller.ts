import { Request, Response } from "express";
import { Event } from "../models/event.model";
import { Registration } from "../models/registration.model";
import { EventStatus, RegistrationStatus, UserRole } from "../models/types";

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== UserRole.EVENT_COORDINATOR && req.user?.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Only event coordinators can create events" });
    }

    const event = new Event({
      ...req.body,
      coordinator: req.user.userId,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: "Could not create event" });
  }
};

// Get all events with optional filters
export const getEvents = async (req: Request, res: Response) => {
  try {
    const {
      status,
      city,
      startDate,
      endDate,
      coordinator,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (city) query["location.city"] = new RegExp(city as string, "i");
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    if (coordinator) query.coordinator = coordinator;

    const events = await Event.find(query)
      .populate("coordinator", "firstName lastName email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(400).json({ error: "Could not fetch events" });
  }
};

// Get a single event by ID
export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("coordinator", "firstName lastName email");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "Could not fetch event" });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (
      event.coordinator.toString() !== req.user?.userId &&
      req.user?.role !== UserRole.ADMIN
    ) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "Could not update event" });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (
      event.coordinator.toString() !== req.user?.userId &&
      req.user?.role !== UserRole.ADMIN
    ) {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    await Registration.deleteMany({ event: event._id });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Could not delete event" });
  }
};

// Register for an event
export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.status !== EventStatus.PUBLISHED) {
      return res.status(400).json({ error: "Event is not open for registration" });
    }

    const existingRegistration = await Registration.findOne({
      event: event._id,
      user: req.user?.userId,
    });

    if (existingRegistration) {
      return res.status(400).json({ error: "Already registered for this event" });
    }

    const currentRegistrations = await Registration.countDocuments({
      event: event._id,
      status: RegistrationStatus.APPROVED,
    });

    if (currentRegistrations >= event.capacity) {
      return res.status(400).json({ error: "Event is at capacity" });
    }

    const registration = new Registration({
      event: event._id,
      user: req.user?.userId,
      notes: req.body.notes,
    });

    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: "Could not register for event" });
  }
};
