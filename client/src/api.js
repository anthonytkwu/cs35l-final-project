import { apiUrl } from "./config.js";
import { ACCESS_TOKEN } from "./config"
import { intercept } from "./hooks/Intercept.js"
import { useNavigate } from "react-router-dom";
import { handleGameDataAndNavigate } from "./utils.js"
import { refreshToken } from "./hooks/RefreshToken.js";

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


export async function postWaitForGameUpdates(body) {
    const gameDataString = localStorage.getItem('game_data');
    if (!gameDataString) {
        console.error('No game data found in local storage');
        throw new Error('No game data found in local storage');
    }

    const gameData = JSON.parse(gameDataString);
    const url = `${apiUrl}/api/session/${gameData.game_code}/wait/`; // Use game_code as per your example

    const requestData = {
        game_code: gameData.game_code,
        draw_time: gameData.draw_time,
        desc_time: gameData.desc_time,
        created_at: gameData.created_at,
        round: gameData.round,
        last_modified: gameData.last_modified,
        users: gameData.users, // Ensure these are arrays
        chains: gameData.chains // Ensure these are arrays
    };

    // Add additional body data
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            requestData[key] = body[key];
        }
    }

    const access = localStorage.getItem('access');
    if (!access) {
        console.error('Authentication token is missing');
        throw new Error('Authentication token is missing');
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData), // Send JSON data
    };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response text:', errorText);
            throw new Error(errorText);
        }

        return await response.json(); // Parse and return JSON directly
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw new Error('There was a problem with the fetch operation');
    }
}

export async function postUserDescription(body, description){
    const gameDataString = localStorage.getItem('game_data');
    const gameData = JSON.parse(gameDataString);
    console.log(gameData)
    console.log(localStorage.getItem('current_user'))
    const userChain = gameData.chains[localStorage.getItem('current_user')]

    if (!gameDataString) {
        console.error('No game data found in local storage');
        throw new Error('No game data found in local storage');
    }
    else if (typeof description != 'string'){
        console.error('Invalid description: wrong type');
        throw new Error('Attempted to upload description with incorrect type parameter');
    }
    else if (!userChain){
        console.error('Unable to find user chain in local storage');
        throw new Error('Unable to find user chain in local storage');
    }
    const url = `${apiUrl}/api/session/${gameData.game_code}/${gameData.round}/${userChain}/desc/`;
    const requestData = {
        //api doesn't take empty desc, so should we generate a random one
        description: description || '[no description]'
    };

    // Add additional body data
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            requestData[key] = body[key];
        }
    }

    const access = localStorage.getItem('access');
    if (!access) {
        console.error('Authentication token is missing');
        throw new Error('Authentication token is missing');
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData), // Send JSON data
    };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response text:', errorText);
            throw new Error(errorText);
        }

        return await response.json(); // Parse and return JSON directly
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw new Error('There was a problem with the fetch operation');
    }
}

export async function postUserDrawing(body, drawingPath){
    const gameDataString = localStorage.getItem('game_data');
    const userChain = localStorage.getItem('current_user_chain');

    if (!gameDataString) {
        console.error('No game data found in local storage');
        throw new Error('No game data found in local storage');
    }
    else if (!userChain){
        console.error('Unable to find user chain in local storage');
        throw new Error('Unable to find user chain in local storage');
    }
    const gameData = JSON.parse(gameDataString);
    const url = `${apiUrl}/api/session/${gameData.game_code}/${gameData.round}/${userChain}/draw/`;
    const requestData = {};

    // Add additional body data
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            requestData[key] = body[key];
        }
    }

    requestData['drawing'] = "C:/Users/awu17/Downloads/drawing.svg";

    const access = localStorage.getItem('access');
    if (!access) {
        console.error('Authentication token is missing');
        throw new Error('Authentication token is missing');
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData), // Send JSON data
    };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response text:', errorText);
            throw new Error(errorText);
        }

        return await response.json(); // Parse and return JSON directly
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw new Error('There was a problem with the fetch operation');
    }
}


export const interceptSVG = async (destination, api_method, form_data, navigate) => {
    const access = localStorage.getItem('access'); 

    const request = async (access) => {
        const options = {
            method: api_method,
            headers: {
              'Authorization': `Bearer ${access}`,
              //'Content-Type': 'multipart/form-data'
            },
            body: form_data,
        };
        // if (json_body) {
        //     options.body = JSON.stringify(json_body);
        // }
        console.log(`${destination}`);
        const response = await fetch(`${destination}`, options);
        return response;
    }

    try {
        // try a request

        let response = await request(access);
        

        if (response.status == 401) {
            console.log('refreshing access token.');
            // refreshes the access token
            try {
                console.log("BEFORE");
                const newAccessToken = await refreshToken();
                if (newAccessToken && newAccessToken.access) {
                    // try new access token
                    try { 
                        response = await request(newAccessToken.access);
                        localStorage.setItem("access", newAccessToken.access);
                    } catch (error) {
                        console.error('failed retry with new access token');
                        navigate('/login');
                        throw new Error();
                    }
                } 
            } catch (error) {
                console.error('failed to refresh token');
                navigate('/login');
                throw new Error('Token refresh failed: ', error);
            }
        }

        if (response.ok) {
            return await response.text();
        } else {
            console.error('Response was not OK:', response.statusText);
            throw new Error(response.statusText);
        }

    } catch (error) {
        console.error('There was an error with the fetch.');
    }

}
