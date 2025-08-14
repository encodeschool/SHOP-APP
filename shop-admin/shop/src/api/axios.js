import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://shop.encode.uz/api',
    // headers: {
    //     'Content-Type': 'application/json'
    // },
});

export default instance;