import Interests from './Interests';
import EventHistory from './EventHistory';
import Analytics from './Analytics';
import Calendar from '../Calendar';
import ManagedOrgs from './ManagedOrgs';
import UserEvents from './UserEvents';
import Points from '../Points';
import type { Event } from '~/schemas/eventsSchema';


export default function Admin({
  user,  
  causes,
  allEvents
}: {
  user: any;
  causes: any;
  allEvents: Event[];
}) {
  const interestsList = user?.interests;
  const managedOrgs = user?.manages_orgs;
  const userEvents = user?.events_attending || [];
  // console.log(`managedOrgs:`, JSON.stringify(managedOrgs));
  // console.log(`userEvents:`, JSON.stringify(userEvents));
  
  const isOrgManager = managedOrgs && managedOrgs.length > 0;
  const isEventAttendee = userEvents && userEvents.length > 0;
  
  const getCalendarEvents = () => {
    if (isOrgManager) {
      const sponsoredEventIds = new Set();
      managedOrgs.forEach((org: any) => {
        org.sponsoring.forEach((s: any) => sponsoredEventIds.add(s.Event));
      });
      
      const managedOrgEvents = allEvents.filter(event => sponsoredEventIds.has(event.uuid));
      
      return managedOrgEvents.map(event => ({
        id: event.uuid,
        title: event.name,
        date: new Date(event.timestamp),
        time: new Date(event.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'managing'
      }));
    } else if (isEventAttendee) {
      return userEvents.map((event: any) => ({
        id: event.uuid,
        title: event.name,
        date: new Date(event.timestamp),
        time: new Date(event.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'attending'
      }));
    }
    
    return [];
  };

  const calendarEvents = getCalendarEvents();

  // const handleEventClick = (event: any) => {
  //   console.log('Calendar event clicked:', event);
  // };

  // const handleDateSelect = (date: Date) => {
  //   console.log('Date selected:', date);
  // };
  

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
            
            {user && (
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-lg">Welcome, {user.name}!</p>
                            <p className="text-sm text-gray-600">
                                {isOrgManager && "Organization Manager"}
                                {isEventAttendee && "Event Participant"}
                                {!isOrgManager && !isEventAttendee && "Getting Started"}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Points points={user.points || 0} variant="inline" size="large" />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
                {isEventAttendee && (
                    <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600">My Events</h2>
                        <UserEvents userEvents={userEvents} />
                    </div>
                )}

                {isOrgManager && (
                    <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-600">Managed Organizations</h2>
                        <ManagedOrgs userOrgs={managedOrgs} allEvents={allEvents} />
                    </div>
                )}

                {(isEventAttendee || isOrgManager) && (
                    <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h2 className="text-2xl font-semibold mb-4 text-green-600">
                            {isEventAttendee ? "My Event Calendar" : "Organization Event Calendar"}
                        </h2>
                        <Calendar 
                            events={calendarEvents}
                            // onEventClick={handleEventClick}
                            // onDateSelect={handleDateSelect}
                        />
                    </div>
                )}

                {(isEventAttendee || isOrgManager) && (
                    <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h2 className="text-2xl font-semibold mb-4 text-yellow-600">My Points</h2>
                        <Points points={user?.points || 0} variant="card" size="medium" />
                    </div>
                )}

                {!isEventAttendee && !isOrgManager && (
                    <div className="col-span-full">
                        <div className="bg-white rounded-lg shadow-md p-8 border text-center">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-600">Get Started</h2>
                            <p className="text-gray-600 mb-4">You're not currently attending any events or managing any organizations.</p>
                            <p className="text-sm text-gray-500">Explore available volunteer opportunities to get involved in your community!</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl">
                <div className="bg-white rounded-lg shadow-md p-6 border md:col-span-2 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-purple-600">Interests</h3>
                    <Interests 
                        userInterests={interestsList}
                        causes={causes}
                    />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border">
                    <h3 className="text-lg font-semibold mb-4 text-orange-600">Event History</h3>
                    <EventHistory />
                </div>
                
                {/* <div className="bg-white rounded-lg shadow-md p-6 border">
                    <h3 className="text-lg font-semibold mb-4 text-green-600">Calendar</h3>
                    <Calendar 
                        events={calendarEvents}
                        onEventClick={handleEventClick}
                        onDateSelect={handleDateSelect}
                    />
                </div> */}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 max-w-7xl">
                <div className="bg-white rounded-lg shadow-md p-6 border">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Analytics</h3>
                    <Analytics />
                </div>
            </div>

            
        </div>
    )
};