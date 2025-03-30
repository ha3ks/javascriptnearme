import { Event } from "@/types";

const MOCK_CITIES = [
  { city: "San Francisco", state: "CA" },
  { city: "New York", state: "NY" },
  { city: "Seattle", state: "WA" },
  { city: "Austin", state: "TX" },
  { city: "Boston", state: "MA" },
];

const MOCK_TOPICS = [
  "React Fundamentals",
  "Advanced Node.js",
  "TypeScript Workshop",
  "Vue.js for Beginners",
  "Full Stack Development",
  "JavaScript Testing",
  "Web Performance",
  "GraphQL Mastery",
];

const MOCK_DESCRIPTIONS = [
  "Join us for an intensive workshop where you'll learn the core concepts and best practices.",
  "A hands-on session focused on building real-world applications with modern tools and techniques.",
  "Deep dive into advanced topics with industry experts and fellow developers.",
  "Perfect for beginners looking to start their journey in web development.",
  "Learn how to build scalable applications from experienced developers.",
];

export function generateMockEvent(overrides?: Partial<Event>): Event {
  const location = MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)];
  const title = MOCK_TOPICS[Math.floor(Math.random() * MOCK_TOPICS.length)];
  const description = MOCK_DESCRIPTIONS[Math.floor(Math.random() * MOCK_DESCRIPTIONS.length)];

  const mockEvent: Event = {
    _id: `mock-event-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      address: `${Math.floor(Math.random() * 1000)} Main St`,
      city: location.city,
      state: location.state,
      postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: "USA",
    },
    capacity: Math.floor(Math.random() * 50) + 10,
    prerequisites: [
      "Basic JavaScript knowledge",
      "Laptop with Node.js installed",
    ],
    coordinator: {
      _id: "mock-coordinator-id",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    attendees: [],
    status: "published",
    ...overrides,
  };

  return mockEvent;
}

export function generateMockEvents(count: number): Event[] {
  return Array.from({ length: count }, () => generateMockEvent());
}
