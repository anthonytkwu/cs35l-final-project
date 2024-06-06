import { apiUrl } from "./config.js";
import { ACCESS_TOKEN } from "./config"

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// })

// api.interceptors.request.use(
    
// )

export async function getGameInformation(gameId) {
    try {
        const access = localStorage.getItem('access'); 
        if (!access) {
            throw new Error('Authentication token is missing');
        }
        const response = await fetch(`${apiUrl}/api/session/${gameId}/info/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw new Error('There was a problem fetching game information');
    }
}

export async function joinExistingGame(gameId){
    try{
        const access = localStorage.getItem('access'); 
        if (!access) {
            throw new Error('Authentication token is missing');
        }
        const response = await fetch(`${apiUrl}/api/session/${gameId}/info/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }catch (error){
        console.error("There was a problem with the get operation", error);
        throw new Error('There was a problem joining existing game');
    }
}