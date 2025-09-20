import React from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
}

interface EventListProps {
  events?: Event[];
  onEventClick?: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events = [],
  onEventClick
}) => {
  return (
    <div className="event-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div 
            key={event.id} 
            className="event-list-item"
            onClick={() => onEventClick?.(event)}
          >
            {/* Event list item implementation */}
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </div>
        ))
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
};

export default EventList;