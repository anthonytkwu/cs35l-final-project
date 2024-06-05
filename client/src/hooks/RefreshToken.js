import { apiUrl } from "../config";

export const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');

    const refreshBody = {
        refresh: refresh
    };
    try {
        const response = await fetch(`${apiUrl}/api/user/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refreshBody),
        });

        // if response is good it refreshes the access token
        if (response.ok) {
            const obj = await response.json();
            console.log('refreshed access: ' + obj.access);
            localStorage.setItem('access', obj.access);
            return obj;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('There was a problem with the refresh fetch operation', error);
        return null;
    }
};
