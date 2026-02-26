import axios, {
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
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
const CSRF_HEADER = 'X-CSRF-Token';
const CSRF_COOKIE_KEYS = ['tai_csrf', 'csrf_token', 'XSRF-TOKEN'] as const;
const DEFAULT_GET_TTL_MS = 30000;

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

const requestCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<unknown>>();

interface ApiEnvelope<T> {
  data?: T;
  result?: T;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getCookieValue = (key: string): string | null => {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${key}=`));

  if (!cookie) return null;

  const [, raw = ''] = cookie.split('=');
  return decodeURIComponent(raw);
};

const getCsrfToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  for (const key of CSRF_COOKIE_KEYS) {
    const cookieToken = getCookieValue(key);
    if (cookieToken) return cookieToken;
  }

  try {
    return window.sessionStorage.getItem('tai_csrf') ?? window.localStorage.getItem('tai_csrf');
  } catch {
    return null;
  }
};

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
  (config) => {
    const method = (config.method ?? 'get').toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const token = getCsrfToken();
      if (token) {
        const nextHeaders =
          config.headers instanceof AxiosHeaders
            ? config.headers
            : new AxiosHeaders(config.headers);
        if (!nextHeaders.has(CSRF_HEADER)) {
          nextHeaders.set(CSRF_HEADER, token);
        }
        config.headers = nextHeaders;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
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

const requestWithCache = async <T>(
  cacheKey: string,
  request: () => Promise<T>,
  ttlMs = DEFAULT_GET_TTL_MS,
): Promise<T> => {
  const now = Date.now();
  const cached = requestCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) {
    return inFlight as Promise<T>;
  }

  const promise = request()
    .then((result) => {
      requestCache.set(cacheKey, { value: result, expiresAt: Date.now() + ttlMs });
      return result;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, promise);
  return promise;
};

export const clearApiCache = (prefix?: string): void => {
  if (!prefix) {
    requestCache.clear();
    return;
  }

  for (const key of requestCache.keys()) {
    if (key.startsWith(prefix)) {
      requestCache.delete(key);
    }
  }
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
  getOrders: () =>
    requestWithCache(
      'c2c:orders',
      () =>
        withMockFallback<C2COrder[]>(
          () => requestData(api.get<C2COrder[]>('/api/c2c/orders')),
          [
            { id: "C2C-001", type: "sell", amount: 15000, price: 1.45, fiatAmount: 21750, fiatCurrency: "USD", paymentMethods: ["Bank Transfer"], merchant: { id: "m1", name: "CyberWhale", completedOrders: 450, completionRate: 99.5 }, status: "pending", createdAt: new Date().toISOString() },
            { id: "C2C-002", type: "buy", amount: 500, price: 1.48, fiatAmount: 5180, fiatCurrency: "CNY", paymentMethods: ["Alipay", "WeChat"], merchant: { id: "m2", name: "QuickPay_AI", completedOrders: 1205, completionRate: 98.2 }, status: "pending", createdAt: new Date().toISOString() },
            { id: "C2C-003", type: "sell", amount: 80000, price: 1.42, fiatAmount: 113600, fiatCurrency: "USD", paymentMethods: ["Wire"], merchant: { id: "m3", name: "Institution_X", completedOrders: 89, completionRate: 100 }, status: "pending", createdAt: new Date().toISOString() },
            { id: "C2C-004", type: "buy", amount: 150, price: 1.50, fiatAmount: 225, fiatCurrency: "EUR", paymentMethods: ["SEPA"], merchant: { id: "m4", name: "EuroBot", completedOrders: 3320, completionRate: 97.4 }, status: "pending", createdAt: new Date().toISOString() },
            { id: "C2C-005", type: "sell", amount: 3500, price: 1.46, fiatAmount: 5110, fiatCurrency: "USD", paymentMethods: ["Bank Transfer"], merchant: { id: "m5", name: "NeonTrader", completedOrders: 12, completionRate: 85.0 }, status: "pending", createdAt: new Date().toISOString() }
          ],
          'GET /api/c2c/orders'
        ),
      15000
    ),
  createOrder: (data: C2COrderCreatePayload) =>
    requestData(api.post('/api/c2c/order/create', data)),
  matchOrder: (orderId: string) =>
    requestData(api.post('/api/c2c/order/match', { orderId })),
};

export const coreApi = {
  getPrice: () =>
    requestWithCache(
      'core:price',
      () =>
        withMockFallback<CorePrices>(
          () => requestData(api.get<CorePrices>('/price')),
          { tai: 1.45, btc: 64230, eth: 3450 },
          'GET /price',
        ),
      15000,
    ),
  getAddresses: () =>
    requestWithCache(
      'core:addresses',
      () =>
        withMockFallback<CoreAddresses>(
          () => requestData(api.get<CoreAddresses>('/addresses')),
          { router: 'EQD5_xxxxxxxxxxxxxxx', staking: 'EQD6_yyyyyyyyyyyyyyy' },
          'GET /addresses',
        ),
      10 * 60 * 1000,
    ),
  getStakingInfo: () =>
    requestWithCache(
      'core:staking',
      () =>
        withMockFallback<StakingInfo>(
          () => requestData(api.get<StakingInfo>('/staking/info')),
          { totalStaked: 1000000, apy: '15%' },
          'GET /staking/info',
        ),
      60000,
    ),
  getVestingStatus: () =>
    requestWithCache(
      'core:vesting',
      () =>
        withMockFallback<VestingStatus>(
          () => requestData(api.get<VestingStatus>('/vesting/status')),
          {
            totalVested: 50000000,
            claimed: 12500000,
            locked: 37500000,
            nextUnlock: '2026-11-01',
          },
          'GET /vesting/status',
        ),
      60000,
    ),
};

export const rawApiRequest = <T = unknown>(config: AxiosRequestConfig) =>
  requestData(api.request<T>(config));

export default api;
