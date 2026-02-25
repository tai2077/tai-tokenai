import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import type {
  AiCreatePayload,
  C2COrder,
  C2COrderCreatePayload,
  CoreAddresses,
  CorePrices,
  StakingInfo,
  TokenCreatePayload,
  TradePayload,
  UserProfile,
  VestingStatus,
  WalletLimits,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.tai.lat';
const ALLOW_MOCK_FALLBACK =
  import.meta.env.DEV && import.meta.env.VITE_ALLOW_MOCK === 'true';

interface ApiEnvelope<T> {
  data?: T;
  result?: T;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const unwrapPayload = <T>(payload: unknown): T => {
  if (isRecord(payload)) {
    const envelope = payload as ApiEnvelope<T>;
    if (envelope.data !== undefined) return envelope.data;
    if (envelope.result !== undefined) return envelope.result;
  }
  return payload as T;
};

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
});

axiosRetry(api, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 429 ||
    error.response?.status === 503,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('tai:unauthorized'));
    }
    return Promise.reject(error);
  },
);

const requestData = async <T>(
  requestPromise: Promise<AxiosResponse<unknown>>,
): Promise<T> => {
  const response = await requestPromise;
  return unwrapPayload<T>(response.data);
};

export async function withMockFallback<T>(
  request: () => Promise<T>,
  mockData: T,
  endpointName: string,
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (ALLOW_MOCK_FALLBACK) {
      // Keep local dev unblocked when backend endpoints are unavailable.
      console.warn(`[API FALLBACK] ${endpointName}`, error);
      return mockData;
    }
    throw new Error(`${endpointName} failed`, { cause: error });
  }
}

export const userApi = {
  getProfile: () => requestData(api.get<UserProfile>('/api/user/profile')),
  bindWallet: (address: string) =>
    requestData(api.post('/api/user/bindWallet', { address })),
};

export const walletApi = {
  getBalance: () => requestData(api.get('/api/wallet/balance')),
  deposit: (amount: number) =>
    requestData(api.post('/api/wallet/deposit', { amount })),
  withdraw: (amount: number) =>
    requestData(api.post('/api/wallet/withdraw', { amount })),
  setLimits: (limits: WalletLimits) =>
    requestData(api.put('/api/wallet/limits', limits)),
};

export const aiApi = {
  getList: () => requestData(api.get('/api/ai/list')),
  create: (data: AiCreatePayload) => requestData(api.post('/api/ai/create', data)),
  start: (id: string) => requestData(api.post(`/api/ai/${id}/start`)),
  stop: (id: string) => requestData(api.post(`/api/ai/${id}/stop`)),
};

export const tokenApi = {
  getList: () => requestData(api.get('/api/token/list')),
  create: (data: TokenCreatePayload) =>
    requestData(api.post('/api/token/create', data)),
  getDetail: (id: string) => requestData(api.get(`/api/token/${id}`)),
};

export const tradeApi = {
  buy: (data: TradePayload) => requestData(api.post('/api/trade/buy', data)),
  sell: (data: TradePayload) => requestData(api.post('/api/trade/sell', data)),
  getHistory: () => requestData(api.get('/api/trade/history')),
};

export const c2cApi = {
  getOrders: () => requestData(api.get<C2COrder[]>('/api/c2c/orders')),
  createOrder: (data: C2COrderCreatePayload) =>
    requestData(api.post('/api/c2c/order/create', data)),
  matchOrder: (orderId: string) =>
    requestData(api.post('/api/c2c/order/match', { orderId })),
};

export const coreApi = {
  getPrice: () =>
    withMockFallback<CorePrices>(
      () => requestData(api.get<CorePrices>('/price')),
      { tai: 1.45, btc: 64230, eth: 3450 },
      'GET /price',
    ),
  getAddresses: () =>
    withMockFallback<CoreAddresses>(
      () => requestData(api.get<CoreAddresses>('/addresses')),
      { router: 'EQD5_xxxxxxxxxxxxxxx', staking: 'EQD6_yyyyyyyyyyyyyyy' },
      'GET /addresses',
    ),
  getStakingInfo: () =>
    withMockFallback<StakingInfo>(
      () => requestData(api.get<StakingInfo>('/staking/info')),
      { totalStaked: 1000000, apy: '15%' },
      'GET /staking/info',
    ),
  getVestingStatus: () =>
    withMockFallback<VestingStatus>(
      () => requestData(api.get<VestingStatus>('/vesting/status')),
      {
        totalVested: 500000,
        claimed: 100000,
        locked: 400000,
        nextUnlock: '2026-06-01',
      },
      'GET /vesting/status',
    ),
};

export const rawApiRequest = <T = unknown>(config: AxiosRequestConfig) =>
  requestData(api.request<T>(config));

export default api;
