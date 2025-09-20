import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { getSession } from "~/sessions.server";
import EventList from "../components/home/EventList";
import Calendar from "../components/Calendar";
import { getEvents } from "~/utils/eventsUtils";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionData = {
    token: session.get("token"),
    user: session.get("user"),
  };

  const events = await getEvents();
  // console.log(`Loaded ${events.length} events from API`);

  return { sessionData, events };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Altruix - Home" },
    { name: "description", content: "Discover and participate in community volunteer events" },
  ];
}

export default function Home() {
  const { sessionData, events } = useLoaderData<typeof loader>();

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
  };

  // const handleDateSelect = (date: Date) => {
  //   console.log('Date selected:', date);
  // };

  const calendarEvents = events.map(event => ({
    id: event.uuid || event.name,
    title: event.name,
    date: new Date(event.timestamp * 1000),
    time: new Date(event.timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  const glassStyle = "border-2 border-gray-300 rounded-xl bg-white/30 bg-transparent backdrop-blur-lg shadow-lg p-6";

  return (
    <div className="container w-full mx-auto -mt-4 bg-white">
      <h1 className="text-4xl text-center font-bold mb-6">Home</h1>
      
      {sessionData.user ? (
        <div className="mb-8">
          <p className="text-lg text-center">Welcome, {sessionData.user.name}!</p>
        </div>
      ) : (
        <p className="mb-8">Welcome! Please log in to access personalized features.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Upcoming Events</h2>
          {events.length > 0 ? (
            <EventList 
              events={events} 
              onEventClick={handleEventClick}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">Unable to load events at this time.</p>
              <p className="text-sm text-gray-400">Please try refreshing the page or check back later.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Event Calendar</h2>
          <Calendar 
            events={calendarEvents}
            // onEventClick={handleEventClick}
            // onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
}
