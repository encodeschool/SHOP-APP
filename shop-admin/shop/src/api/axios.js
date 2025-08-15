import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
    baseURL: `${BASE_URL}/api`,
    // headers: {
    //     'Content-Type': 'application/json'
    // },
});

export default instance;