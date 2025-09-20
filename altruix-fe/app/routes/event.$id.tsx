import type { Route } from "./+types/event.$id";
import { useLoaderData, Link, useActionData, Form, useNavigation } from "react-router";
import { redirect } from "react-router";
import EventCard from "../components/EventCard";
import { getEvents, registerForEvent } from "~/utils/eventsUtils";
import type { Event } from "~/schemas/eventsSchema";
import { EventInformation, OrganizationAbout, EventSponsors } from "../components/events";
import { getSession } from "~/sessions.server";
import { useEffect } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const { eventId } = params;
  
  const events = await getEvents();
  
  const event = events.find((event: Event) => {
    const eventSlug = event.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return eventSlug === eventId;
  });

  if (!event) {
    throw redirect('/');
  }

  return { event };
}

export async function action({ params, request }: Route.ActionArgs) {
  console.log('Action called with params:', params);
  
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  
  console.log('Session token:', token ? 'Token exists' : 'No token found');
  
  if (!token) {
    console.log('No token - returning error');
    return { 
      error: "You must be logged in to register for events",
      success: false 
    };
  }

  const { eventId } = params;
  console.log('Looking for event with slug:', eventId);
  
  const event = await getEventBySlug(eventId);
  
  console.log('Found event:', event ? `${event.name} (${event.uuid})` : 'Event not found');
  
  if (!event) {
    return { 
      error: "Event not found",
      success: false 
    };
  }

  try {
    console.log('Calling registerForEvent with:', { eventId: event.uuid, hasToken: token });
    
    const result = await registerForEvent({
      eventId: event.uuid,
      token: token
    });
    
    console.log('Registration successful:', result);
    
    return { 
      success: true,
      message: "Successfully registered for the event!" 
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return { 
      error: error instanceof Error ? error.message : "Registration failed",
      success: false 
    };
  }
}

async function getEventBySlug(eventSlug: string) {
  const events = await getEvents();
  return events.find((event: Event) => {
    const slug = event.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return slug === eventSlug;
  });
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.event) {
    return [
      { title: "Event Not Found" },
      { name: "description", content: "The requested event could not be found." },
    ];
  }

  return [
    { title: `${data.event.name} | altruva Events` },
    { name: "description", content: data.event.description.substring(0, 160) + "..." },
  ];
}

export default function EventDetails() {
  const { event } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  // Check if we're currently submitting the registration form
  const isRegistering = navigation.state === "submitting" && navigation.formMethod === "POST";
  
  console.log('Event Data:', event);
  console.log('Action Data:', actionData);
  console.log('Navigation State:', navigation.state);
  console.log('Is Registering:', isRegistering);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-gray-400">Event Details</span>
        </div>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.name}</h1>
        <p className="text-lg text-gray-600">
          Organized by <span className="font-semibold text-blue-600">{event.organization.name}</span>
        </p>
      </div>

      <div className="mb-8">
        <EventCard 
          event={event} 
          showFullDetails={true}
          className="max-w-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <EventInformation event={event} />
        <OrganizationAbout event={event} />
      </div>

      <EventSponsors event={event} />

      {actionData?.success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p className="font-semibold">✓ {actionData.message}</p>
        </div>
      )}
      
      {actionData?.error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">✗ {actionData.error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Form method="post" className="inline">
          <button 
            type="submit"
            disabled={isRegistering || actionData?.success}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRegistering ? 'Registering...' : actionData?.success ? 'Registered ✓' : 'Register for Event'}
          </button>
        </Form>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
          Share Event
        </button>
        <Link 
          to="/" 
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}