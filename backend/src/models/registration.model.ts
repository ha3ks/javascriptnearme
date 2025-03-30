import mongoose, { Schema, Document } from "mongoose";
import { IRegistration, RegistrationStatus } from "./types";

export interface IRegistrationDocument extends IRegistration, Document {}

const registrationSchema = new Schema<IRegistrationDocument>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RegistrationStatus),
      default: RegistrationStatus.PENDING,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
registrationSchema.index({ event: 1, user: 1 }, { unique: true });
registrationSchema.index({ user: 1 });
registrationSchema.index({ event: 1 });
registrationSchema.index({ status: 1 });

// Add a compound index for filtering registrations by event and status
registrationSchema.index({ event: 1, status: 1 });

export const Registration = mongoose.model<IRegistrationDocument>("Registration", registrationSchema);

