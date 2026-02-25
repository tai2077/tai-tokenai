import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.tai.tii.mom';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000
});

// 请求拦截器：添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tai_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器：处理错误
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // 在这里可以处理一些全局错误，比如 token 过期
        if (error.response?.status === 401) {
            localStorage.removeItem('tai_token');
            // 可以派发一个全局事件跳回登录或断开钱包
        }
        return Promise.reject(error);
    }
);

export const userApi = {
    getProfile: () => api.get('/api/user/profile'),
    bindWallet: (address: string) => api.post('/api/user/bindWallet', { address })
};

export const walletApi = {
    getBalance: () => api.get('/api/wallet/balance'),
    deposit: (amount: number) => api.post('/api/wallet/deposit', { amount }),
    withdraw: (amount: number) => api.post('/api/wallet/withdraw', { amount }),
    setLimits: (limits: { dailyLimit: number, minWithdraw?: number, method?: string, account?: string }) => api.put('/api/wallet/limits', limits)
};

export const aiApi = {
    getList: () => api.get('/api/ai/list'),
    create: (data: any) => api.post('/api/ai/create', data),
    start: (id: string) => api.post(`/api/ai/${id}/start`),
    stop: (id: string) => api.post(`/api/ai/${id}/stop`)
};

export const tokenApi = {
    getList: () => api.get('/api/token/list'),
    create: (data: any) => api.post('/api/token/create', data),
    getDetail: (id: string) => api.get(`/api/token/${id}`)
};

export const tradeApi = {
    buy: (data: any) => api.post('/api/trade/buy', data),
    sell: (data: any) => api.post('/api/trade/sell', data),
    getHistory: () => api.get('/api/trade/history')
};

export const c2cApi = {
    getOrders: () => api.get('/api/c2c/orders'),
    createOrder: (data: any) => api.post('/api/c2c/order/create', data),
    matchOrder: (orderId: string) => api.post('/api/c2c/order/match', { orderId })
};

export default api;
