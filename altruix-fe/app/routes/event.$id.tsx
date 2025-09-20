import type { Route } from "./+types/event.$id";
import { useLoaderData, Link } from "react-router";
import { redirect } from "react-router";
import EventCard from "../components/EventCard";
import { getEvents } from "~/utils/eventsUtils";
import type { Event } from "~/schemas/eventsSchema";
import { EventInformation, OrganizationAbout, EventSponsors } from "../components/events";

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

export function meta({ data }: Route.MetaArgs) {
  if (!data?.event) {
    return [
      { title: "Event Not Found" },
      { name: "description", content: "The requested event could not be found." },
    ];
  }

  return [
    { title: `${data.event.name} | Altruix Events` },
    { name: "description", content: data.event.description.substring(0, 160) + "..." },
  ];
}

export default function EventDetails() {
  const { event } = useLoaderData<typeof loader>();

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

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          Register for Event
        </button>
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