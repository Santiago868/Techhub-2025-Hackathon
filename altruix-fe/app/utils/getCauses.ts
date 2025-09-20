

export interface AuthOptions {
    token?: string;
}

export async function getCauses(
    options: AuthOptions
) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error('BASE_URL is not defined in environment variables');
    }
    
    const authUrl = `${baseUrl}/causes`;

    try { 
        const response = await fetch(authUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.token}`,
                'ngrok-skip-browser-warning': 'true', 
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        
        return data;
        
    } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Authentication failed');
    }

}