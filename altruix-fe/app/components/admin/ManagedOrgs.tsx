import { Link } from 'react-router';
import type { Organization } from '~/schemas/orgScehma';
import type { Event } from '~/schemas/eventsSchema';

interface ManagedOrgsProps {
  userOrgs: Organization[];
  allEvents: Event[];
}

export default function ManagedOrgs({ userOrgs, allEvents }: ManagedOrgsProps) {
//   console.log(allEvents);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!userOrgs || userOrgs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">You are not managing any organizations.</p>
        <p className="text-sm text-gray-400">Contact us to become an organization manager!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">{userOrgs.length} organization{userOrgs.length !== 1 ? 's' : ''} managed</p>
      {userOrgs.map((org) => {
        const sponsoredEventIds = new Set(org.sponsoring.map(s => s.Event));
        console.log('Sponsored Event IDs for org', org.name, sponsoredEventIds);
        const orgEvents = allEvents.filter(event => sponsoredEventIds.has(event.uuid));
        console.log(`Events for org ${org.name}:`, orgEvents);
        return (
          <div key={org.uuid} className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{org.name}</h4>
              <div className="text-sm text-gray-600 mb-2">
                <span>📍 {org.location}</span>
                <span className="ml-4">🎯 {org.causes.join(', ')}</span>
              </div>
            </div>
            
            {orgEvents.length > 0 ? (
              <div className="space-y-3">
                <h5 className="text-md font-medium text-gray-700">Sponsored Events:</h5>
                {orgEvents.map(event => (
                  <div key={event.uuid} className="bg-gray-50 border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        to={`/event/${event.uuid}`}
                        className="text-md font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {event.name}
                      </Link>
                      <span className="text-sm text-gray-500">{event.attendees_count} attendees</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span>📅 {formatDate(event.timestamp)}</span>
                      <span>📍 {event.location}</span>
                      <span>🏷️ {event.causes.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No sponsored events found for this organization.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
