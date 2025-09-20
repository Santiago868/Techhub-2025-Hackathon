import { Link } from 'react-router';
import type { Event } from '~/schemas/eventsSchema';

interface UserEventsProps {
  userEvents: Event[];
}

export default function UserEvents({ userEvents }: UserEventsProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!userEvents || userEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">You are not attending any events.</p>
        <p className="text-sm text-gray-400">Browse available events to get involved!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">{userEvents.length} event{userEvents.length !== 1 ? 's' : ''} attending</p>
      {userEvents.map((event) => (
        <div key={event.uuid} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <Link 
              to={`/event/${event.uuid}`}
              className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {event.name}
            </Link>
            <span className="text-sm text-gray-500">{event.attendees_count} attendees</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-3">{event.description}</p>
          
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
            <span>📅 {formatDate(event.timestamp)}</span>
            <span>📍 {event.location}</span>
            <span>🏷️ {event.causes.join(', ')}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Organized by:</span>
              <span className="ml-2">{event.organization.name}</span>
              <span className="ml-4 text-gray-500">📍 {event.organization.location}</span>
            </div>
            {event.sponsors && event.sponsors.length > 1 && (
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Additional sponsors:</span>
                <span className="ml-2">
                  {event.sponsors
                    .filter(sponsor => sponsor.uuid !== event.organization.uuid)
                    .map(sponsor => sponsor.name)
                    .join(', ')
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}