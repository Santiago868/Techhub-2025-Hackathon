import type { Event } from '~/schemas/eventsSchema';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

interface OrganizationAboutProps {
  event: Event;
}

export default function OrganizationAbout({ event }: OrganizationAboutProps) {
  return (
    <Card className="bg-white shadow-md border">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">About the Organization</h2>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-blue-600 text-lg mb-2">{event.organization.name}</h3>
          <p className="text-gray-600 mb-3">📍 {event.organization.location}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Focus Areas</h4>
          <div className="flex flex-wrap gap-2">
            {event.organization.causes.map((cause, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
              >
                {cause}
              </Badge>
            ))}
          </div>
        </div>

        {event.organization.sponsoring && event.organization.sponsoring.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Other Activities</h4>
            <p className="text-gray-600 text-sm">
              This organization sponsors {event.organization.sponsoring.length} other initiatives
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}