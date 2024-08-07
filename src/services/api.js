import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_DJANGO_USERPROFILE_SERVICE;

console.log("this is my api " + API_BASE_URL);


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
