import type { EventsResponse } from '~/schemas/eventsSchema';

export interface AuthOptions {
    token?: string;
}

export interface UpdateEventsOptions extends AuthOptions {
    userName: string;
    eventData?: any; 
}

export async function getEvents() {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        console.warn('BASE_URL is not defined in environment variables');
        return [];
    }
    
    const eventsUrl = `${baseUrl}/events`;
 
    try { 
        const response = await fetch(eventsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true', 
            },
        });

        if (!response.ok) {
            console.error(`Events API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data: EventsResponse[] = await response.json();
        
        // Handle the nested format: data is an array of objects with "events" property
        if (!Array.isArray(data)) {
            console.error('Events API returned non-array data:', data);
            return [];
        }

        // Extract events from the nested structure (no transformation needed)
        const allEvents = data.flatMap((item: EventsResponse) => {
            if (item.events && Array.isArray(item.events)) {
                return item.events;
            }
            return [];
        });

        console.log(`Processed ${allEvents.length} events from API`);
        return allEvents;
        
    } catch (error) {
        console.error('Get events error:', error);
        return [];
    }
}


export async function updateEvents(options: UpdateEventsOptions) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error('BASE_URL is not defined in environment variables');
    }
    
    const eventsUrl = `${baseUrl}/events`;

    try { 
        const response = await fetch(eventsUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.token}`,
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({
                userName: options.userName,
                ...(options.eventData && { eventData: options.eventData }),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Update events error:', error);
        throw new Error(`Failed to update events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}