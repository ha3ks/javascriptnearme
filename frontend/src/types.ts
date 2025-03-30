export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "event_coordinator" | "admin";
}

export interface Location {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  registrationDeadline?: string;
  location: Location;
  capacity: number;
  prerequisites?: string[];
  coordinator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  attendees?: string[];
  status: "draft" | "published" | "cancelled" | "completed";
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}
