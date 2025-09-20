import type { Event } from '~/schemas/eventsSchema';

interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  showFullDetails?: boolean;
  className?: string;
}

export default function EventCard({ 
  event, 
  onClick, 
  showFullDetails = false,
  className = "" 
}: EventCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`event-card bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      } ${className}`}
      onClick={() => onClick?.(event)}
    >
      <div className="relative">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {event.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="font-medium text-blue-600">
                  🏢 {event.organization.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-center min-w-[60px]">
                <div className="text-lg font-bold">{formatShortDate(event.timestamp).split(' ')[1]}</div>
                <div className="text-xs">{formatShortDate(event.timestamp).split(' ')[0]}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(event.timestamp)}
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <span className="mr-1">📍</span>
              <span className="font-medium">{event.organization.location}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">👥</span>
              <span className="font-medium">{event.attendees_count} attendees</span>
            </div>
          </div>

          {event.organization.causes.length > 0 && (
            <div className="mb-4">
              <span className="text-sm text-gray-500 block mb-2">Causes:</span>
              <div className="flex flex-wrap gap-1">
                {event.organization.causes.map((cause, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium"
                  >
                    {cause}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.sponsors.length > 0 && (
            <div className="mb-4">
              <span className="text-sm text-gray-500 block mb-2">Sponsored by:</span>
              <div className="space-y-1">
                {event.sponsors.map((sponsor, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium text-purple-600">{sponsor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showFullDetails && event.organization.sponsoring.length > 0 && (
            <div className="mb-4">
              <span className="text-sm text-gray-500 block mb-2">Organization also sponsors:</span>
              <div className="text-sm text-gray-600">
                {event.organization.sponsoring.length} other initiatives
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {formatDate(event.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

