import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

let sessionModalShown = false;

const triggerSessionExpiredModal = () => {
    if (sessionModalShown) return;
    sessionModalShown = true;

    window.dispatchEvent(new CustomEvent('session-expired'));
};

api.interceptors.response.use(
    response => response,
    async (error) => {
        const status = error.response?.status;
        const config = error.config;

        if (status === 419 && config && !config._retry) {
            config._retry = true;
            try{
            await api.get('/sanctum/csrf-cookie');
            return api.request(config);
            } catch {
                triggerSessionExpiredModal();
                return Promise.reject(error);
            }
        }

        if (status === 401 || status === 419) {
            triggerSessionExpiredModal();
        }

        return Promise.reject(error);
    }
);

export default api;
