import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ======================
// Add token interceptor
// ======================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // pata token
        if (token) {
            config.headers.Authorization = `Token ${token}`; // ongeza kwenye headers
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ======================
// CRUD functions
// ======================
export const getusers = () => api.get('users/');
export const getuser = (id) => api.get(`users/${id}/`);

export const createuser = (data) => api.post('users/', data);
export const updateuser = (id, data) => api.patch(`users/${id}/`, data);
export const deleteuser = (id) => api.delete(`users/${id}/`);

export const getbusinesses = () => api.get('businesses/');
export const getBusiness = (id) => api.get(`businesses/${id}/`);

export const createbusiness = (data) => api.post('businesses/', data);
export const updatebusiness = (id, data) => api.put(`businesses/${id}/`, data);
export const deletebusiness = (id) => api.delete(`businesses/${id}/`);

export const getpayments = () => api.get('payments/');
export const getpayment = (id) => api.get(`payments/${id}/`);

export const creatpayment = (data) => api.post('payments/', data);
export const updatepayment = (id, data) => api.put(`payments/${id}/`, data);
export const deletepayment = (id) => api.delete(`payments/${id}/`);

export default api;
