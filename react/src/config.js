import axios from 'axios';

const mediaharbor_api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8000/api'
});

export default mediaharbor_api;