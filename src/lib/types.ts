export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface Achievement {
  id: number;
  name: string;
  desc: string;
  unlocked: boolean;
}

export interface UserProfile {
  address: string;
  level: number;
  title: string;
  achievements: Achievement[];
}

export interface WalletBalances {
  main: number;
  ai: number;
}

export interface C2COrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  fiatAmount: number;
  fiatCurrency: string;
  paymentMethods: string[];
  merchant: {
    id: string;
    name: string;
    completedOrders: number;
    completionRate: number;
  };
  status: 'pending' | 'matched' | 'paid' | 'completed';
  createdAt: string;
}

export interface CorePrices {
  tai: number;
  btc: number;
  eth: number;
}

export interface CoreAddresses {
  router: string;
  staking: string;
}

export interface StakingInfo {
  totalStaked: number;
  apy: string;
}

export interface VestingStatus {
  totalVested: number;
  claimed: number;
  locked: number;
  nextUnlock: string;
}

export interface WalletLimits {
  dailyLimit: number;
  minWithdraw?: number;
  method?: string;
  account?: string;
}

export interface TokenCreatePayload {
  name: string;
  symbol: string;
  description?: string;
  logoUrl?: string;
}

export interface TradePayload {
  tokenId: string;
  amount: number;
  slippage?: number;
}

export interface C2COrderCreatePayload {
  amount: number;
  price: number;
  side: 'buy' | 'sell';
  methods: string[];
}

export interface AiCreatePayload {
  name: string;
  strategy: string;
  settings?: Record<string, unknown>;
}
