import Admin from "~/components/admin/Admin";
import type { Route } from "./+types/admin.$id";
import { useLoaderData } from "react-router";
import { getSession } from "~/sessions.server";
import { getCauses } from "~/utils/getCauses";
// import { getOrganizations } from "~/utils/getOrganizations";
import { getEvents } from "~/utils/eventsUtils";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const token = session.get("token");
  
  let causes = null;
  try {
    causes = await getCauses({ token });
  } catch (error) {
    console.error("Failed to fetch causes:", error);
    causes = { causes: [] };
  }

  const allEvents = await getEvents();
  
  let userEventsAttending = [];
  if (user?.events_attending && Array.isArray(user.events_attending)) {
    const isUuidArray = user.events_attending.length > 0 && typeof user.events_attending[0] === 'string';
    
    if (isUuidArray) {
      userEventsAttending = allEvents.filter(event => 
        user.events_attending && user.events_attending.includes(event.uuid)
      );
    } else {
      userEventsAttending = user.events_attending;
    }
  }

  const userWithMappedEvents = {
    ...user,
    events_attending: userEventsAttending
  };
  
  return {
    user: userWithMappedEvents,
    causes,
    allEvents,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to the Admin Dashboard!" },
  ];
}

export default function AdminPage() {
  const { user, causes, allEvents } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {user && (
        <p>Welcome, {user.name || user.username}!</p>
      )}
      <Admin
        user={user}
        causes={causes}
        allEvents={allEvents}
      />
    </div>
  );
}
