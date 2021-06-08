import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: process.env.backendURL || 'http://127.0.0.1:4000'
});

export default clienteAxios;