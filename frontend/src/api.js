import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE || (
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '/api'
);

const api = axios.create({ baseURL });

export default api;
