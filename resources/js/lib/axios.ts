import axios from 'axios';


const baseConfig = {
  baseURL: '/',
  withCredentials: true,
};


const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});


export const uploadApi = axios.create({
  ...baseConfig,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  },
});

let sessionModalShown = false;

const triggerSessionExpiredModal = () => {
    if (sessionModalShown) return;
    sessionModalShown = true;

    window.dispatchEvent(new CustomEvent('session-expired'));
};

const PUBLIC_ROUTES = ['/kiosk/categories', '/kiosk/cart', '/kiosk/sub-categories', '/Kiosk/products', '/kiosk/product-variations'];

const isPublicRoute = (url: string = '') =>
  PUBLIC_ROUTES.some((r) => url.includes(r));

const attachInterceptors = (client: typeof api) => {
  client.interceptors.response.use(
    response => response,
    async (error) => {
      const status = error.response?.status;
      const config = error.config;

      if (isPublicRoute(config?.url)) {
        return Promise.reject(error);
      }

      if (status === 419 && config && !config._retry) {
        config._retry = true;

        try {
          await client.get('/sanctum/csrf-cookie');
          return client.request(config);
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
};

attachInterceptors(api);
attachInterceptors(uploadApi);

export default api;
