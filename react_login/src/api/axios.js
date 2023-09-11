import axios from 'axios';
const BASE_URL = 'https://54.179.240.101';

export default axios.create({
    baseURL: BASE_URL,
});
export const axiosPrivate =  axios.create({
    baseURL: BASE_URL,
    headers:{'Content-Type': 'application/json'},
    withCredentials: true
});