import axios from 'axios';

const API_BASE_URL = process.env.DJANGO_USERPROFILE_SERVICE;

//DJANGO_USERPROFILE_SERVICE=http://127.0.0.1:8000/api/

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
