import { z } from 'zod';
import { organizationSchema } from './orgScehma';


export const sponsorSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  causes: z.array(z.string()),
  location: z.string(),
  sponsoring: z.array(z.any()),
});

export const eventSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  organization: organizationSchema,
  description: z.string(),
  timestamp: z.number(), 
  attendees_count: z.number(),
  sponsors: z.array(sponsorSchema),
  location: z.string(),
  causes: z.array(z.string()),
});

export const eventsResponseSchema = z.object({
  events: z.array(eventSchema),
});

export type Sponsor = z.infer<typeof sponsorSchema>;
export type Event = z.infer<typeof eventSchema>;
export type EventsResponse = z.infer<typeof eventsResponseSchema>;

export const eventListSchema = z.array(eventSchema);
export type EventList = z.infer<typeof eventListSchema>;