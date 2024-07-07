const apiUrl = 'https://api.reanmo-tweeter.de/api';

const apiConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
};

export {
    apiUrl,
    apiConfig
}