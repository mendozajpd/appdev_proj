import axios from "axios";

const axiosClient = axios.create({
    // ZERO TIER
    baseURL: 'http://192.168.193.206:8000/api'
    // LOCAL HOST
    // baseURL: 'http://localhost:8000/api'

    // SAIL
    // baseURL: 'http://localhost:80/api'
});

export default axiosClient;