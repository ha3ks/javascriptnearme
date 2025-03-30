"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types";
import { generateMockEvent } from "@/utils/mockData";
import { useLocalStorage } from "react-use";

const MOCK_EVENTS_COUNT = 6;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [mockEvents, setMockEvents] = useLocalStorage<Event[]>("mockEvents", []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      // During development, use mock data if the API is not available
      if (process.env.NODE_ENV === "development") {
        if (!mockEvents || mockEvents.length === 0) {
          // Generate initial mock events if none exist
          const initialMockEvents = Array.from({ length: MOCK_EVENTS_COUNT }, () =>
            generateMockEvent({
              title: `${["React", "Node.js", "TypeScript", "JavaScript", "Next.js", "GraphQL"][Math.floor(Math.random() * 6)]} Workshop`,
              description: `Learn ${["modern", "advanced", "practical", "essential", "professional"][Math.floor(Math.random() * 5)]} development techniques and best practices.`,
            })
          );
          setMockEvents(initialMockEvents);
          setEvents(initialMockEvents);
        } else {
          setEvents(mockEvents);
        }
      } else {
        setError("Failed to fetch events. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            JavaScript Events
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Find and join JavaScript events in your area
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <a
            href="/events/create"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Event
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {event.title}
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{event.description}</p>
              </div>
              <div className="mt-3 text-sm">
                <p className="text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  {event.location.city}, {event.location.state}
                </p>
                <p className="text-gray-500 mt-1">
                  {event.status === "published" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open for Registration
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a
                  href={`/events/${event._id}`}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  View Details
                  <span className="ml-2" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
}
