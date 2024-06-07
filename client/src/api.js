import { apiUrl } from "./config.js";
import { ACCESS_TOKEN } from "./config"
import { intercept } from "./hooks/Intercept.js"
import { useNavigate } from "react-router-dom";
import { handleGameDataAndNavigate } from "./utils.js"

export async function createGame(data, navigate){
    intercept("/api/session/create/", 'POST', data, navigate)
    .then((data) => {
        handleGameDataAndNavigate(data, navigate);
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });
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
    const userChain = localStorage.getItem('current_user_chain');

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
    const gameData = JSON.parse(gameDataString);
    const url = `${apiUrl}/api/session/${gameData.game_code}/${gameData.round}/${userChain}/desc/`;
    const requestData = {
        //api doesn't take empty desc, so should we generate a random one
        description: description ? description : '[no description]'
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

export async function getDescription(gameData, navigate) {

    const username = localStorage.getItem('username')
    const data = {};

    //    URL: api/session/<str:game_code>/<int:round>/<int:chain>/getDesc/
    const unsername = localStorage.getItem('username')
    console.log(gameData)
    const url = `/api/session/${gameData.game_code}/${gameData.round - 1}/${gameData.chains[0]['asdf']}/getDesc/`
    console.log(url)
    intercept(url, 'GET', data, navigate)
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error occurred');
        });


}