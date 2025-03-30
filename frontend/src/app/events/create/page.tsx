"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/events";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    capacity: "",
    prerequisites: "",
    registrationDeadline: "",
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        prerequisites: formData.prerequisites
          ? formData.prerequisites.split(",").map((p) => p.trim())
          : [],
        status: "draft" as const,
      };

      try {
        await createEvent(eventData as any, token);
        router.push("/events");
      } catch (err) {
        // In development, simulate successful event creation
        if (process.env.NODE_ENV === "development") {
          console.log("Development mode: Simulating event creation", eventData);
          router.push("/events");
          return;
        }
        throw err;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user || (user.role !== "event_coordinator" && user.role !== "admin")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          You do not have permission to create events.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create Event
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Fill out the form to create a new JavaScript event.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      id="date"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      id="capacity"
                      required
                      min="1"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
                    Prerequisites (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="prerequisites"
                    id="prerequisites"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    id="registrationDeadline"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.location.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, address: e.target.value },
                      })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.location.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value },
                      })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.location.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, state: e.target.value },
                      })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.location.postalCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, postalCode: e.target.value },
                      })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.location.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, country: e.target.value },
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
