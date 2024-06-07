import { apiUrl } from "../config";
import { refreshToken } from "./RefreshToken";

export const intercept = async (destination, api_method, json_body, navigate) => {
    const access = localStorage.getItem('access'); 

    const request = async (access) => {
        const options = {
            method: api_method,
            headers: {
              'Authorization': `Bearer ${access}`,
              'Content-Type': 'application/json'
            }
        };
        if (json_body) {
            options.body = JSON.stringify(json_body);
        }
        console.log(`${apiUrl}${destination}`);
        const response = await fetch(`${apiUrl}${destination}`, options);
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
            const obj = await response.json();
            console.log(obj);
            return obj;
        } else {
            console.error('Response was not OK:', response.statusText);
            throw new Error(response.statusText);
        }

    } catch (error) {
        console.error('There was an error with the fetch.');
    }


}