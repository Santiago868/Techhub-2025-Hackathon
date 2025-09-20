import type { Event } from '~/schemas/eventsSchema';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';

interface EventListProps {
  events?: Event[];
  onEventClick?: (event: Event) => void;
}

export default function EventList({
  events = [], 
  onEventClick,
}: EventListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No events available</p>
      </div>
    );
  }

  // if (useCards) {
  //   return (
  //     <div className="event-list space-y-4">
  //       {events.map((event, index) => (
  //         <EventCard
  //           key={event.id || index}
  //           event={event}
  //           onClick={onEventClick}
  //         />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <div className="event-list space-y-4">
      {events.map((event, index) => (
        <Card 
          key={event.id || index} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEventClick?.(event)}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {event.attendees_count} attendees
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-gray-700 text-sm">{event.description}</p>
            
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span className="font-medium">{formatDate(event.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏢</span>
                <span className="font-medium">{event.organization.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span className="font-medium">{event.organization.location}</span>
              </div>
            </div>

            {event.organization.causes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-gray-500">Causes:</span>
                <div className="flex flex-wrap gap-1">
                  {event.organization.causes.map((cause, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {cause}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {event.sponsors.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-gray-500">Sponsors:</span>
                <div className="flex flex-wrap gap-1">
                  {event.sponsors.map((sponsor, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline"
                      className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {sponsor.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-3 border-t">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                {formatDate(event.timestamp)}
              </div>
              {onEventClick && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link 
                    to={`/events/${event.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                  >
                    View Details →
                  </Link>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

