export enum UserRole {
  USER = "user",
  EVENT_COORDINATOR = "event_coordinator",
  ADMIN = "admin"
}

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CANCELLED = "cancelled",
  COMPLETED = "completed"
}

export enum RegistrationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled"
}

export interface IEvent {
  title: string;
  description: string;
  date: Date;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: number;
  coordinator: string; // Reference to User
  status: EventStatus;
  prerequisites?: string[];
  registrationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistration {
  event: string; // Reference to Event
  user: string; // Reference to User
  status: RegistrationStatus;
  registrationDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
