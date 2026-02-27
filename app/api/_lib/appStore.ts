export type AppCategory =
  | "lottery"
  | "vote"
  | "game"
  | "tool"
  | "display"
  | "other";

export type DomainType = "free" | "premium";
export type AppSort = "hot" | "new" | "rating" | "revenue";
export type AppUsageAction = "open" | "interact" | "pay";

export interface PublicAppReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PublicApp {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  url: string;
  creator: { id: string; name: string };
  token?: { id: string; symbol: string; price: number };
  stats: { users: number; dau: number; revenue: number };
  rating: number;
  ratingCount: number;
  reviews: PublicAppReview[];
  createdAt: string;
  icon?: string;
}

export interface DeployTokenInput {
  name: string;
  symbol: string;
  description?: string;
  logo?: string;
  initialSupply?: number;
}

export interface DeployedToken {
  tokenId: string;
  address: string;
  explorerUrl: string;
  symbol: string;
  name: string;
  description?: string;
  logo?: string;
  initialSupply: number;
  createdAt: string;
}

export interface CreateAppInput {
  name: string;
  description?: string;
  category: AppCategory;
  code: string;
  subdomain: string;
  domainType?: DomainType;
  tokenId?: string;
  creatorId?: string;
  creatorName?: string;
  icon?: string;
}

export interface RegisterDomainInput {
  name: string;
  type: DomainType;
  ownerId: string;
}

interface StoredDomain {
  id: string;
  name: string;
  ownerId: string;
  appId?: string;
  type: DomainType;
  pricePaid: number;
  expiresAt: string;
  createdAt: string;
}

interface StoredAppUsage {
  id: string;
  appId: string;
  userId: string;
  action: AppUsageAction;
  amount: number;
  createdAt: string;
}

interface StoredApp {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  creatorId: string;
  creatorName: string;
  codeHash: string;
  subdomain: string;
  domainType: DomainType;
  tokenId?: string;
  totalUsers: number;
  dailyActive: number;
  totalRevenue: number;
  rating: number;
  ratingCount: number;
  reviews: PublicAppReview[];
  status: "draft" | "published" | "suspended";
  createdAt: string;
  updatedAt: string;
  icon?: string;
}

interface InternalStore {
  idCounter: number;
  tokenCounter: number;
  apps: Map<string, StoredApp>;
  domains: Map<string, StoredDomain>;
  codeByHash: Map<string, string>;
  usageByApp: Map<string, StoredAppUsage[]>;
  dailyActiveByApp: Map<string, Set<string>>;
  deployedTokens: Map<string, DeployedToken>;
}

const RESERVED_DOMAINS = new Set(["admin", "api", "root", "store", "builder"]);

const DEFAULT_SAMPLE_CODE = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lucky Wheel</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b0b0f; color: #fff; font-family: system-ui, sans-serif; }
      .card { border: 1px solid #333; border-radius: 16px; padding: 32px; text-align: center; background: #121216; }
      .btn { border: 0; border-radius: 10px; background: #00ff41; color: #000; padding: 12px 20px; font-weight: 700; cursor: pointer; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>幸运转盘</h1>
      <p>每次抽奖消耗 100 DOGE2</p>
      <button class="btn">SPIN</button>
    </div>
  </body>
</html>`;

const sanitizeText = (input: string): string => input.replace(/[<>]/g, "");

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const normalizeDomain = (name: string): string => name.trim().toLowerCase();

const isValidSubdomain = (name: string): boolean =>
  /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/.test(name);

const deriveTokenSymbol = (tokenId: string): string => {
  const normalized = tokenId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return (normalized.slice(0, 6) || "TKN").padEnd(3, "X");
};

const deriveTokenPrice = (tokenId: string): number => {
  let hash = 0;
  for (let i = 0; i < tokenId.length; i += 1) {
    hash = (hash << 5) - hash + tokenId.charCodeAt(i);
    hash |= 0;
  }
  const price = Math.abs(hash % 5000) / 10000 + 0.0005;
  return Number(price.toFixed(4));
};

const getGlobalStore = (): InternalStore => {
  const globalRef = globalThis as typeof globalThis & {
    __taiAppStore?: InternalStore;
  };

  if (globalRef.__taiAppStore) {
    return globalRef.__taiAppStore;
  }

  const createdAt = "2026-02-20T00:00:00.000Z";
  const apps = new Map<string, StoredApp>();
  const domains = new Map<string, StoredDomain>();
  const codeByHash = new Map<string, string>();
  const usageByApp = new Map<string, StoredAppUsage[]>();
  const dailyActiveByApp = new Map<string, Set<string>>();
  const deployedTokens = new Map<string, DeployedToken>();

  const sampleAppId = "app-1";
  const sampleDomain = "lottery";
  const sampleCodeHash = "app:app-1:code";
  const sampleTokenId = "DOGE2";

  codeByHash.set(sampleCodeHash, DEFAULT_SAMPLE_CODE);
  apps.set(sampleAppId, {
    id: sampleAppId,
    name: "幸运转盘",
    description: "用 DOGE2 代币参与转盘抽奖，赢取丰厚奖励！",
    category: "lottery",
    creatorId: "user-1",
    creatorName: "DOGE2 社区",
    codeHash: sampleCodeHash,
    subdomain: sampleDomain,
    domainType: "premium",
    tokenId: sampleTokenId,
    totalUsers: 12345,
    dailyActive: 2340,
    totalRevenue: 45000,
    rating: 4.8,
    ratingCount: 1234,
    reviews: [
      {
        id: "review-seed-1",
        userId: "user-a",
        rating: 5,
        comment: "很好玩，中大奖了！",
        date: "2026-02-21T00:00:00.000Z",
      },
      {
        id: "review-seed-2",
        userId: "user-b",
        rating: 4,
        comment: "界面漂亮，体验流畅。",
        date: "2026-02-22T00:00:00.000Z",
      },
    ],
    status: "published",
    createdAt,
    updatedAt: createdAt,
    icon: "🎰",
  });

  domains.set(sampleDomain, {
    id: "domain-1",
    name: sampleDomain,
    ownerId: "user-1",
    appId: sampleAppId,
    type: "premium",
    pricePaid: 100,
    expiresAt: "2027-02-20T00:00:00.000Z",
    createdAt,
  });

  dailyActiveByApp.set(sampleAppId, new Set(["user-a", "user-b"]));

  globalRef.__taiAppStore = {
    idCounter: 10,
    tokenCounter: 10,
    apps,
    domains,
    codeByHash,
    usageByApp,
    dailyActiveByApp,
    deployedTokens,
  };

  return globalRef.__taiAppStore;
};

const nextId = (prefix: string): string => {
  const store = getGlobalStore();
  store.idCounter += 1;
  return `${prefix}-${Date.now()}-${store.idCounter}`;
};

const nextTokenId = (): string => {
  const store = getGlobalStore();
  store.tokenCounter += 1;
  return `token-${Date.now()}-${store.tokenCounter}`;
};

const toPublicApp = (app: StoredApp): PublicApp => {
  const result: PublicApp = {
    id: app.id,
    name: app.name,
    description: app.description,
    category: app.category,
    url: `https://${app.subdomain}.tai.lat`,
    creator: { id: app.creatorId, name: app.creatorName },
    stats: {
      users: app.totalUsers,
      dau: app.dailyActive,
      revenue: Number(app.totalRevenue.toFixed(2)),
    },
    rating: Number(app.rating.toFixed(2)),
    ratingCount: app.ratingCount,
    reviews: [...app.reviews].sort((a, b) => (a.date < b.date ? 1 : -1)),
    createdAt: app.createdAt,
  };

  if (app.tokenId) {
    result.token = {
      id: app.tokenId,
      symbol: deriveTokenSymbol(app.tokenId),
      price: deriveTokenPrice(app.tokenId),
    };
  }
  if (app.icon) {
    result.icon = app.icon;
  }
  return result;
};

const domainPrice = (name: string, type: DomainType): number => {
  if (type === "free") return 0;
  return name.length <= 4 ? 100 : 30;
};

export const checkDomainAvailability = (
  nameRaw: string,
  type: DomainType = "free",
): { available: boolean; price: number; reason?: string } => {
  const store = getGlobalStore();
  const name = normalizeDomain(nameRaw);

  if (!name) {
    return { available: false, price: 0, reason: "Domain name is required" };
  }
  if (!isValidSubdomain(name)) {
    return {
      available: false,
      price: 0,
      reason: "Domain must be 3-32 chars of lowercase letters, numbers, hyphen",
    };
  }
  if (RESERVED_DOMAINS.has(name)) {
    return { available: false, price: 0, reason: "Reserved domain" };
  }
  if (store.domains.has(name)) {
    return { available: false, price: 0, reason: "Domain already taken" };
  }
  return { available: true, price: domainPrice(name, type) };
};

export const registerDomain = (input: RegisterDomainInput): StoredDomain => {
  const store = getGlobalStore();
  const name = normalizeDomain(input.name);
  const available = checkDomainAvailability(name, input.type);
  if (!available.available) {
    throw new Error(available.reason || "Domain unavailable");
  }

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const domain: StoredDomain = {
    id: nextId("domain"),
    name,
    ownerId: input.ownerId,
    type: input.type,
    pricePaid: available.price,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
  };
  store.domains.set(name, domain);
  return domain;
};

export const listApps = (params: {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): { apps: PublicApp[]; total: number; page: number; limit: number } => {
  const store = getGlobalStore();
  const page = clamp(Number(params.page || 1) || 1, 1, 999);
  const limit = clamp(Number(params.limit || 20) || 20, 1, 100);
  const category = params.category?.trim().toLowerCase() || "all";
  const sort = (params.sort?.trim().toLowerCase() || "hot") as AppSort;

  const records = [...store.apps.values()].filter((app) => app.status === "published");
  const filtered =
    category === "all"
      ? records
      : records.filter((app) => app.category === (category as AppCategory));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "new") return a.createdAt < b.createdAt ? 1 : -1;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "revenue") return b.totalRevenue - a.totalRevenue;
    return b.dailyActive + b.totalUsers * 0.1 - (a.dailyActive + a.totalUsers * 0.1);
  });

  const start = (page - 1) * limit;
  const paged = sorted.slice(start, start + limit).map(toPublicApp);
  return { apps: paged, total: filtered.length, page, limit };
};

export const searchApps = (queryRaw: string): PublicApp[] => {
  const store = getGlobalStore();
  const query = queryRaw.trim().toLowerCase();
  if (!query) return [];
  return [...store.apps.values()]
    .filter((app) => {
      const tokenSymbol = app.tokenId ? deriveTokenSymbol(app.tokenId).toLowerCase() : "";
      return (
        app.status === "published" &&
        (app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.category.toLowerCase().includes(query) ||
          tokenSymbol.includes(query))
      );
    })
    .map(toPublicApp);
};

export const getAppById = (id: string): PublicApp | null => {
  const store = getGlobalStore();
  const app = store.apps.get(id);
  if (!app || app.status !== "published") return null;
  return toPublicApp(app);
};

export const createPublishedApp = (
  input: CreateAppInput,
): { app: PublicApp; appId: string; url: string } => {
  const store = getGlobalStore();
  const subdomain = normalizeDomain(input.subdomain);
  const domainType = input.domainType || "free";

  const domainCheck = checkDomainAvailability(subdomain, domainType);
  if (!domainCheck.available) {
    throw new Error(domainCheck.reason || "Domain unavailable");
  }

  const now = new Date().toISOString();
  const appId = nextId("app");
  const codeHash = `code:${appId}:${Date.now()}`;
  const icon = input.icon?.trim() || "📱";
  const name = sanitizeText(input.name).slice(0, 64);
  const description = sanitizeText(input.description || "AI generated app").slice(0, 400);

  const newApp: StoredApp = {
    id: appId,
    name: name || "Untitled App",
    description,
    category: input.category,
    creatorId: input.creatorId || "me",
    creatorName: input.creatorName || "CURRENT_USER",
    codeHash,
    subdomain,
    domainType,
    totalUsers: 0,
    dailyActive: 0,
    totalRevenue: 0,
    rating: 0,
    ratingCount: 0,
    reviews: [],
    status: "published",
    createdAt: now,
    updatedAt: now,
    icon,
  };
  if (input.tokenId) {
    newApp.tokenId = input.tokenId;
  }

  const domain = registerDomain({
    name: subdomain,
    type: domainType,
    ownerId: newApp.creatorId,
  });
  domain.appId = appId;
  store.domains.set(subdomain, domain);

  store.codeByHash.set(codeHash, input.code);
  store.apps.set(appId, newApp);

  return { app: toPublicApp(newApp), appId, url: `https://${subdomain}.tai.lat` };
};

export const recordAppUsage = (params: {
  appId: string;
  userId?: string;
  action?: AppUsageAction;
  amount?: number;
}): void => {
  const store = getGlobalStore();
  const app = store.apps.get(params.appId);
  if (!app) {
    throw new Error("App not found");
  }

  const action = params.action || "open";
  const userId = params.userId || "anonymous";
  const amount = Math.max(0, Number(params.amount || 0));

  const usages = store.usageByApp.get(app.id) || [];
  usages.push({
    id: nextId("usage"),
    appId: app.id,
    userId,
    action,
    amount,
    createdAt: new Date().toISOString(),
  });
  store.usageByApp.set(app.id, usages);

  const dauSet = store.dailyActiveByApp.get(app.id) || new Set<string>();
  const wasKnownToday = dauSet.has(userId);
  dauSet.add(userId);
  store.dailyActiveByApp.set(app.id, dauSet);

  if (action === "open" && !wasKnownToday) {
    app.totalUsers += 1;
    app.dailyActive = dauSet.size;
  } else if (action === "interact" && !wasKnownToday) {
    app.dailyActive = dauSet.size;
  } else if (action === "pay") {
    app.totalRevenue = Number((app.totalRevenue + amount).toFixed(2));
  }

  app.updatedAt = new Date().toISOString();
  store.apps.set(app.id, app);
};

export const addOrUpdateReview = (params: {
  appId: string;
  userId?: string;
  rating: number;
  comment?: string;
}): PublicAppReview => {
  const store = getGlobalStore();
  const app = store.apps.get(params.appId);
  if (!app) throw new Error("App not found");

  const userId = (params.userId || "anonymous").trim();
  const rating = clamp(Number(params.rating) || 0, 1, 5);
  const comment = sanitizeText((params.comment || "").trim()).slice(0, 500);
  const now = new Date().toISOString();
  const existingIndex = app.reviews.findIndex((item) => item.userId === userId);

  let review: PublicAppReview;
  if (existingIndex >= 0) {
    const existing = app.reviews[existingIndex]!;
    review = {
      id: existing.id,
      userId: existing.userId,
      rating,
      comment,
      date: now,
    };
    app.reviews[existingIndex] = review;
  } else {
    review = {
      id: nextId("review"),
      userId,
      rating,
      comment,
      date: now,
    };
    app.reviews.push(review);
  }

  const totalScore = app.reviews.reduce((sum, item) => sum + item.rating, 0);
  app.ratingCount = app.reviews.length;
  app.rating = app.ratingCount > 0 ? Number((totalScore / app.ratingCount).toFixed(2)) : 0;
  app.updatedAt = now;
  store.apps.set(app.id, app);
  return review;
};

export const deployToken = (input: DeployTokenInput): DeployedToken => {
  const store = getGlobalStore();
  const tokenId = nextTokenId();
  const symbol = sanitizeText(input.symbol).toUpperCase().slice(0, 10) || "TKN";
  const name = sanitizeText(input.name).slice(0, 64) || "Unnamed Token";
  const address = `EQ${tokenId.replace(/[^a-zA-Z0-9]/g, "").slice(-16)}`;
  const deployed: DeployedToken = {
    tokenId,
    address,
    explorerUrl: `https://tonscan.org/address/${address}`,
    symbol,
    name,
    description: sanitizeText(input.description || "").slice(0, 300),
    logo: input.logo || "",
    initialSupply: Math.max(1, Math.floor(Number(input.initialSupply || 1_000_000))),
    createdAt: new Date().toISOString(),
  };
  store.deployedTokens.set(tokenId, deployed);
  return deployed;
};
