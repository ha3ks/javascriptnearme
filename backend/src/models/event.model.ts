import mongoose, { Schema, Document } from "mongoose";
import { IEvent, EventStatus } from "./types";

export interface IEventDocument extends IEvent, Document {}

const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
    },
    prerequisites: [{
      type: String,
    }],
    registrationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
eventSchema.index({ date: 1 });
eventSchema.index({ "location.city": 1 });
eventSchema.index({ coordinator: 1 });
eventSchema.index({ status: 1 });

export const Event = mongoose.model<IEventDocument>("Event", eventSchema);

