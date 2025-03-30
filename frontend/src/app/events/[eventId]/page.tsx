"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Event } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getEvent, registerForEvent, deleteEvent, updateEvent } from "@/services/events";
import { generateMockEvent } from "@/utils/mockData";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [params.eventId]);

  async function fetchEvent() {
    try {
      const data = await getEvent(params.eventId as string);
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event:", err);
      if (process.env.NODE_ENV === "development") {
        const mockEvent = generateMockEvent({
          _id: params.eventId as string,
          status: "published",
        });
        setEvent(mockEvent);
      } else {
        setError("Failed to load event details");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister() {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsRegistering(true);
    setRegistrationError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await registerForEvent(event!._id, token);
      // Refresh event data to update attendee count
      await fetchEvent();
    } catch (err: any) {
      setRegistrationError(err.message || "Failed to register for event");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleStatusChange(newStatus: Event["status"]) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await updateEvent(event!._id, { status: newStatus }, token);
      await fetchEvent();
    } catch (err: any) {
      setError(err.message || "Failed to update event status");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await deleteEvent(event!._id, token);
      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  const isCoordinator = user && event.coordinator._id === user._id;
  const isAttendee = user && event.attendees?.includes(user._id);
  const isPublished = event.status === "published";
  const isCancelled = event.status === "cancelled";
  const isCompleted = event.status === "completed";
  const canRegister = isPublished && !isAttendee && !isCoordinator;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {event.title}
            </h1>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  isPublished
                    ? "bg-green-100 text-green-800"
                    : isCancelled
                    ? "bg-red-100 text-red-800"
                    : isCompleted
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.status}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900">Details</h2>
            <p className="mt-2 text-gray-500">{event.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900">Date & Time</h2>
            <p className="mt-2 text-gray-500">
              {new Date(event.date).toLocaleString()}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900">Location</h2>
            <p className="mt-2 text-gray-500">
              {event.location.address}
              <br />
              {event.location.city}, {event.location.state}{" "}
              {event.location.postalCode}
              <br />
              {event.location.country}
            </p>
          </div>

          {event.prerequisites && event.prerequisites.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900">Prerequisites</h2>
              <ul className="mt-2 list-disc list-inside text-gray-500">
                {event.prerequisites.map((prerequisite, index) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Event Host</h2>
              <div className="mt-4">
                <p className="text-gray-500">
                  {event.coordinator.firstName} {event.coordinator.lastName}
                </p>
                <p className="text-sm text-gray-500">{event.coordinator.email}</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Capacity</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.attendees?.length || 0} / {event.capacity} registered
                    </p>
                  </div>
                </div>
              </div>

              {registrationError && (
                <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {registrationError}
                </div>
              )}

              {isCoordinator ? (
                <div className="mt-6 space-y-4">
                  {event.status === "draft" && (
                    <button
                      onClick={() => handleStatusChange("published")}
                      className="w-full btn-primary"
                    >
                      Publish Event
                    </button>
                  )}
                  {isPublished && (
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      className="w-full btn-secondary"
                    >
                      Cancel Event
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Delete Event
                  </button>
                </div>
              ) : (
                canRegister && (
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="mt-6 w-full btn-primary"
                  >
                    {isRegistering ? "Registering..." : "Register for Event"}
                  </button>
                )
              )}

              {isAttendee && (
                <p className="mt-6 text-sm text-center text-green-600">
                  You are registered for this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
