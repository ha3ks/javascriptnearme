export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "event_coordinator" | "admin";
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EventCoordinator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: EventLocation;
  capacity: number;
  prerequisites?: string[];
  coordinator: EventCoordinator;
  attendees?: string[];
  status: EventStatus;
}

export interface CreateEventData extends Omit<Event, "_id" | "coordinator" | "attendees" | "status"> {
  status?: EventStatus;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: EventStatus;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface EventFilters {
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  status?: EventStatus;
  searchQuery?: string;
}

export interface AuthResponse extends APIResponse {
  data: {
    token: string;
    user: User;
  };
}
