import { create } from "zustand";
import { coreApi } from "../lib/api";
import type {
  CoreAddresses,
  CorePrices,
  StakingInfo,
  VestingStatus,
} from "../lib/types";

export type AgentRole =
  | "MINER"
  | "SCOUT"
  | "ANALYST"
  | "TRADER"
  | "FUND_MANAGER"
  | "MARKET_MAKER"
  | "OPS"
  | "CS"
  | "AUDIT";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  level: number;
  status: "working" | "resting";
  output: string;
  quote: string;
  avatar: string;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: string;
  mcap: string;
  aiStatus: "working" | "resting";
  type: "HOT" | "NEW" | "TOP" | "CREATED";
  strategy?: string;
  aiStats?: { tweets: number; replies: number; newFollowers: number };
}

export interface Holding {
  tokenId: string;
  amount: number;
  avgPrice: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export type LiveFeedType = "trade" | "scout" | "mine" | "launch" | "analysis";

export interface LiveFeedItem {
  id: number;
  time: string;
  text: string;
  type: LiveFeedType;
  avatar?: string;
}

export interface GlobalData {
  prices: CorePrices;
  addresses: CoreAddresses | null;
  stakingInfo: StakingInfo | null;
  vestingStatus: VestingStatus | null;
}

interface StoreState {
  // Wallets
  mainWallet: {
    address: string | null;
    balance: number;
    connected: boolean;
  };
  aiWallet: {
    address: string | null;
    balance: number;
    dailySpent: number;
    dailyLimit: number;
    status: "active" | "frozen";
  };

  // Balances
  balances: { USDT: number; TAI: number };
  totalAssets: number;
  maxAssets: number;

  // Data
  holdings: Holding[];
  createdTokens: Token[];
  marketTokens: Token[];
  aiAgents: Agent[];
  liveFeed: LiveFeedItem[];
  toasts: ToastMessage[];

  // Global API Data
  globalData: GlobalData;

  // Actions
  fetchGlobalData: () => Promise<void>;
  setMainWallet: (update: Partial<StoreState["mainWallet"]>) => void;
  setAiWallet: (update: Partial<StoreState["aiWallet"]>) => void;
  buyToken: (tokenId: string, amount: number, cost: number) => void;
  sellToken: (tokenId: string, amount: number, revenue: number) => void;
  launchToken: (
    token: Omit<Token, "id">,
    cost: number,
    hiredAgents: Agent[],
  ) => void;
  updateAgentStrategy: (tokenId: string, strategy: string) => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  addFeedEvent: (text: string, type: LiveFeedType) => void;
}

const initialMarketTokens: Token[] = [
  {
    id: "0x123",
    name: "NEON COIN",
    symbol: "$NEON",
    price: 1.45,
    change: "+14.4%",
    mcap: "$1.2M",
    aiStatus: "working",
    type: "HOT",
  },
  {
    id: "0x456",
    name: "CYBER PUNK",
    symbol: "$CYBER",
    price: 0.89,
    change: "-2.1%",
    mcap: "$800K",
    aiStatus: "resting",
    type: "HOT",
  },
  {
    id: "0x789",
    name: "PIXEL DOGE",
    symbol: "$PDOGE",
    price: 0.004,
    change: "+150.2%",
    mcap: "$45K",
    aiStatus: "working",
    type: "NEW",
  },
  {
    id: "0xabc",
    name: "AI ALPHA",
    symbol: "$ALPHA",
    price: 12.5,
    change: "+45.8%",
    mcap: "$12M",
    aiStatus: "working",
    type: "TOP",
  },
  {
    id: "0xdef",
    name: "RETRO BIT",
    symbol: "$RBIT",
    price: 4.2,
    change: "+8.9%",
    mcap: "$4.2M",
    aiStatus: "working",
    type: "TOP",
  },
];

const initialAgents: Agent[] = [
  {
    id: "MINER-01",
    name: "MINER-01",
    role: "MINER",
    level: 3,
    status: "working",
    output: "⚡ +500/h",
    quote: "⚡ 能源产出 +500 | 库存充足",
    avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MINER-01&backgroundColor=0a0a0c&colors=00FF41",
  },
  {
    id: "SCOUT-99",
    name: "SCOUT-99",
    role: "SCOUT",
    level: 2,
    status: "working",
    output: "📰 +2/h",
    quote: "🔍 发现：某巨鲸地址 30 分钟内转入 $50M USDT",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=SCOUT-99&backgroundColor=0a0a0c&colors=3B82F6",
  },
  {
    id: "ANALYST-X",
    name: "ANALYST-X",
    role: "ANALYST",
    level: 1,
    status: "resting",
    output: "📊 +5/h",
    quote: "📊 BTC 4H 分析：支撑位 $66,800，阻力 $68,500",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=ANALYST-X&backgroundColor=0a0a0c&baseColor=8B5CF6",
  },
  {
    id: "TRADER-7",
    name: "TRADER-7",
    role: "TRADER",
    level: 3,
    status: "working",
    output: "💰 +$1234",
    quote: "💰 成交：买入 0.5 ETH @ $3,450",
    avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=TRADER-7&backgroundColor=0a0a0c&colors=EF4444",
  },
];

const fallbackPrices: CorePrices = { tai: 1.45, btc: 64230, eth: 3450 };

const asFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizePrices = (value: unknown): CorePrices => {
  if (typeof value !== "object" || value === null) return fallbackPrices;
  const candidate = value as Partial<Record<keyof CorePrices, unknown>>;

  const tai = asFiniteNumber(candidate.tai);
  const btc = asFiniteNumber(candidate.btc);
  const eth = asFiniteNumber(candidate.eth);

  if (tai === null || btc === null || eth === null) {
    return fallbackPrices;
  }

  return { tai, btc, eth };
};

const normalizeAddresses = (value: unknown): CoreAddresses | null => {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<Record<keyof CoreAddresses, unknown>>;
  if (typeof candidate.router !== "string" || typeof candidate.staking !== "string") {
    return null;
  }
  return { router: candidate.router, staking: candidate.staking };
};

const normalizeStakingInfo = (value: unknown): StakingInfo | null => {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<Record<keyof StakingInfo, unknown>>;
  const totalStaked = asFiniteNumber(candidate.totalStaked);
  if (totalStaked === null || typeof candidate.apy !== "string") {
    return null;
  }
  return { totalStaked, apy: candidate.apy };
};

const normalizeVestingStatus = (value: unknown): VestingStatus | null => {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<Record<keyof VestingStatus, unknown>>;

  const totalVested = asFiniteNumber(candidate.totalVested);
  const claimed = asFiniteNumber(candidate.claimed);
  const locked = asFiniteNumber(candidate.locked);

  if (
    totalVested === null ||
    claimed === null ||
    locked === null ||
    typeof candidate.nextUnlock !== "string"
  ) {
    return null;
  }

  return {
    totalVested,
    claimed,
    locked,
    nextUnlock: candidate.nextUnlock,
  };
};

export const useStore = create<StoreState>((set, get) => ({
  mainWallet: {
    address: null,
    balance: 5000,
    connected: false,
  },
  aiWallet: {
    address: "0x5C6...7D8",
    balance: 1234,
    dailySpent: 56,
    dailyLimit: 500,
    status: "active",
  },
  balances: { USDT: 14500, TAI: 5000 },
  totalAssets: 14500,
  maxAssets: 20000,
  holdings: [
    { tokenId: "0x123", amount: 150000, avgPrice: 1.0 },
    { tokenId: "0x456", amount: 85000, avgPrice: 0.9 },
  ],
  createdTokens: [],
  marketTokens: initialMarketTokens,
  aiAgents: initialAgents,
  liveFeed: [
    {
      id: 1,
      time: "10:42:01",
      text: "TRADER-7 💰 成交：买入 0.5 ETH @ $3,450",
      type: "trade",
      avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=TRADER-7&backgroundColor=0a0a0c&colors=EF4444"
    },
    {
      id: 2,
      time: "10:41:15",
      text: "SCOUT-99 🔍 发现：某巨鲸地址 30 分钟内转入 $50M USDT",
      type: "scout",
      avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=SCOUT-99&backgroundColor=0a0a0c&colors=3B82F6"
    },
    {
      id: 3,
      time: "10:39:50",
      text: "MINER-01 ⚡ 能源产出 +500 | 库存充足",
      type: "mine",
      avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MINER-01&backgroundColor=0a0a0c&colors=00FF41"
    },
    {
      id: 4,
      time: "10:35:22",
      text: "ANALYST-X 📊 BTC 4H 分析：支撑位 $66,800，阻力 $68,500",
      type: "analysis",
      avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=ANALYST-X&backgroundColor=0a0a0c&baseColor=8B5CF6"
    },
  ],
  toasts: [],

  globalData: {
    prices: { tai: 1.45, btc: 64230, eth: 3450 },
    addresses: null,
    stakingInfo: null,
    vestingStatus: null,
  },

  fetchGlobalData: async () => {
    try {
      const [prices, addresses, stakingInfo, vestingStatus] = await Promise.all([
        coreApi.getPrice(),
        coreApi.getAddresses(),
        coreApi.getStakingInfo(),
        coreApi.getVestingStatus(),
      ]);
      set({
        globalData: {
          prices: normalizePrices(prices),
          addresses: normalizeAddresses(addresses),
          stakingInfo: normalizeStakingInfo(stakingInfo),
          vestingStatus: normalizeVestingStatus(vestingStatus),
        },
      });
    } catch (error: unknown) {
      console.error("Failed to fetch global data", error);
    }
  },

  setMainWallet: (update) =>
    set((state) => ({ mainWallet: { ...state.mainWallet, ...update } })),

  setAiWallet: (update) =>
    set((state) => ({ aiWallet: { ...state.aiWallet, ...update } })),

  buyToken: (tokenId, amount, cost) => {
    const {
      balances,
      holdings,
      marketTokens,
      createdTokens,
      addToast,
      addFeedEvent,
    } = get();
    if (balances.USDT < cost) {
      addToast("USDT 余额不足 (INSUFFICIENT FUNDS)", "error");
      return;
    }

    if (amount <= 0 || cost <= 0) {
      addToast("交易数量无效", "error");
      return;
    }

    const newBalances = { ...balances, USDT: balances.USDT - cost };
    const existingHolding = holdings.find((h) => h.tokenId === tokenId);
    let newHoldings: Holding[];

    if (existingHolding) {
      newHoldings = holdings.map((h) =>
        h.tokenId === tokenId
          ? {
            ...h,
            amount: h.amount + amount,
            avgPrice: (h.amount * h.avgPrice + cost) / (h.amount + amount),
          }
          : h,
      );
    } else {
      newHoldings = [...holdings, { tokenId, amount, avgPrice: cost / amount }];
    }

    const token = [...marketTokens, ...createdTokens].find(
      (t) => t.id === tokenId,
    );

    set({ balances: newBalances, holdings: newHoldings });
    addToast(`成功买入 ${amount.toLocaleString()} ${token?.symbol || ""}`, "success");
    addFeedEvent(
      `PLAYER_ONE 💰 成交：买入 ${amount.toLocaleString()} ${token?.symbol || ""} @ $${(cost / amount).toFixed(3)}`,
      "trade",
    );
  },

  sellToken: (tokenId, amount, revenue) => {
    const {
      balances,
      holdings,
      marketTokens,
      createdTokens,
      addToast,
      addFeedEvent,
    } = get();
    if (amount <= 0 || revenue <= 0) {
      addToast("交易数量无效", "error");
      return;
    }

    const existingHolding = holdings.find((h) => h.tokenId === tokenId);

    if (!existingHolding || existingHolding.amount < amount) {
      addToast("持仓余额不足 (INSUFFICIENT BALANCE)", "error");
      return;
    }

    const newBalances = { ...balances, USDT: balances.USDT + revenue };
    const newHoldings = holdings
      .map((h) =>
        h.tokenId === tokenId ? { ...h, amount: h.amount - amount } : h,
      )
      .filter((h) => h.amount > 0);

    const token = [...marketTokens, ...createdTokens].find(
      (t) => t.id === tokenId,
    );

    set({ balances: newBalances, holdings: newHoldings });
    addToast(`成功卖出 ${amount.toLocaleString()} ${token?.symbol || ""}`, "success");
    addFeedEvent(
      `PLAYER_ONE 💰 成交：卖出 ${amount.toLocaleString()} ${token?.symbol || ""} @ $${(revenue / amount).toFixed(3)}`,
      "trade",
    );
  },

  launchToken: (tokenData, cost, hiredAgents) => {
    const { balances, createdTokens, aiAgents, addToast, addFeedEvent } = get();
    if (balances.TAI < cost) {
      addToast("TAI 余额不足 (INSUFFICIENT TAI)", "error");
      return;
    }

    const newToken: Token = {
      ...tokenData,
      id: `0x${Math.random().toString(16).slice(2, 8)}`,
      aiStats: { tweets: 0, replies: 0, newFollowers: 0 },
      strategy: "Aggressive Growth",
    };

    set({
      balances: { ...balances, TAI: balances.TAI - cost },
      createdTokens: [...createdTokens, newToken],
      aiAgents: [...aiAgents, ...hiredAgents],
    });

    addToast(`代币 ${newToken.symbol} 发射成功！`, "success");
    addFeedEvent(
      `🚀 新代币发射：${newToken.name} (${newToken.symbol}) 已上线！`,
      "launch",
    );
  },

  updateAgentStrategy: (tokenId, strategy) => {
    const { createdTokens, addToast } = get();
    const newTokens = createdTokens.map((t) =>
      t.id === tokenId ? { ...t, strategy } : t,
    );
    set({ createdTokens: newTokens });
    addToast(`已更新策略为：${strategy}`, "info");
  },

  addToast: (message, type = "info") => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  addFeedEvent: (text, type) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    set((state) => ({
      liveFeed: [{ id: Date.now(), time, text, type }, ...state.liveFeed].slice(
        0,
        50,
      ),
    }));
  },
}));
