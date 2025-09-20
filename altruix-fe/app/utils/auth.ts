
export interface AuthOptions {
    username?: string;
    password?: string;
}

export async function handleAuth(
    options: AuthOptions
) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error('BASE_URL is not defined in environment variables');
    }
    
    const authUrl = `${baseUrl}/login`;

    try { 
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: options.username,
                password: options.password,
            }),
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