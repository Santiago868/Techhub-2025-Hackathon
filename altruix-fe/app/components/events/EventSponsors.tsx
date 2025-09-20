import type { Event } from '~/schemas/eventsSchema';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

interface EventSponsorsProps {
  event: Event;
}

export default function EventSponsors({ event }: EventSponsorsProps) {
  if (event.sponsors.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white shadow-md border">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">Event Sponsors</h2>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event.sponsors.map((sponsor, idx) => (
            <Card key={idx} className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-purple-700 mb-2">{sponsor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">📍 {sponsor.location}</p>
                <div className="flex flex-wrap gap-1">
                  {sponsor.causes.map((cause, causeIdx) => (
                    <Badge 
                      key={causeIdx}
                      variant="outline"
                      className="bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 text-xs"
                    >
                      {cause}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}