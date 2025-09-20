import type { EventsResponse } from '~/schemas/eventsSchema';

export interface AuthOptions {
    token?: string;
}

export interface UpdateEventsOptions extends AuthOptions {
    userName: string;
    eventData?: any; 
}

export interface RegisterForEventOptions extends AuthOptions {
    eventId: string;
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

        // console.log(`Processed ${allEvents.length} events from API`);
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

export async function registerForEvent(options: RegisterForEventOptions) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error('BASE_URL is not defined in environment variables');
    }
    
    if (!options.token) {
        throw new Error('Authentication token is required for event registration');
    }

    console.log('Registering for event with ID:', options.eventId, 'using token', options.token);
    
    const registerUrl = `${baseUrl}events/${options.eventId}/join`;

    console.log('Register URL:', registerUrl);

    try { 
        const response = await fetch(registerUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        console.log('Register for event response status:', response);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: Please log in to register for events');
            } else if (response.status === 404) {
                throw new Error('Event not found');
            } else if (response.status === 409) {
                throw new Error('You are already registered for this event');
            }
            throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
        }

        const contentLength = response.headers.get('content-length');
        if (contentLength === '0' || !contentLength) {
            console.log('Registration successful - empty response body');
            return { success: true, message: 'Registration successful' };
        }

        try {
            const data = await response.json();
            console.log('Registration response data:', data);
            return data;
        } catch (jsonError) {
            console.log('JSON parse failed but response was OK, treating as success');
            return { success: true, message: 'Registration successful' };
        }
        
    } catch (error) {
        console.error('Register for event error:', error);
        throw new Error(`Failed to register for event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}