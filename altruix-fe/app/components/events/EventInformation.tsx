import type { Event } from '~/schemas/eventsSchema';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

interface EventInformationProps {
  event: Event;
}

export default function EventInformation({ event }: EventInformationProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white shadow-md border">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">Event Information</h2>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">📅 Date & Time</h3>
          <p className="text-gray-600">{formatDate(event.timestamp)}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">📍 Location</h3>
          <p className="text-gray-600">{event.organization.location}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">👥 Attendees</h3>
          <p className="text-gray-600">{event.attendees_count} people attending</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">🎯 Causes</h3>
          <div className="flex flex-wrap gap-2">
            {event.organization.causes.map((cause, idx) => (
              <Badge 
                key={idx}
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                {cause}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}