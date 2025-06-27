import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
    }
);

export const cicilanAPI = {
    // Soal 1: Kalkulasi cicilan
    calculateCicilan: (data) => api.post('/calculate', data),

    // Soal 2: Total angsuran jatuh tempo
    getTotalJatuhTempo: (params) => api.get('/total-jatuh-tempo', { params }),

    // Soal 3: Denda keterlambatan
    getDenda: (params) => api.get('/denda', { params }),

    // Get all kontrak
    getAllKontrak: () => api.get('/kontrak'),

    // Health check
    healthCheck: () => api.get('/health')
};

export default api;