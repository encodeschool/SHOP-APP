import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://shop.encode.uz/api',
    // headers: {
    //     'Content-Type': 'application/json'
    // },
});

export default instance;