
import React from 'react';
import { Calendar as ShadcnCalendar } from "~/components/ui/calendar";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export default function Calendar (
  { events = [], selectedDate, onDateSelect, onEventClick }: CalendarProps
) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate || new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onDateSelect) {
      onDateSelect(newDate);
    }
  };

  return (
    <div className="calendar w-full flex flex-col justify-center items-center">
      <ShadcnCalendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-lg border"
      />
      <div className="calendar-events mt-4">
        <h3 className="text-lg font-semibold mb-2">Events</h3>
        {events.length > 0 ? (
          events.map((event) => (
            <div 
              key={event.id} 
              className="calendar-event p-2 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => onEventClick?.(event)}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-600">
                {event.date.toLocaleDateString()} {event.time && `at ${event.time}`}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No events scheduled</p>
        )}
      </div>
    </div>
  );
};
