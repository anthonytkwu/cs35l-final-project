import { useState } from 'react';

export const useJwtToken = () => {
    const [token, setToken] = useState(null);

    const saveToken = (newToken) => {
        setToken(newToken);
    };

    return {
        token,
        saveToken,
    };
};
