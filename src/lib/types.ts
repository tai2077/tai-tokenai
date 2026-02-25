export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

export interface UserProfile {
    address: string;
    level: number;
    title: string;
    achievements: any[];
}

export interface WalletBalances {
    main: number;
    ai: number;
}

export interface C2COrder {
    id: string;
    seller: string;
    price: number;
    amount: number;
    methods: string[];
    rating: number;
    status: "pending" | "matched" | "paid" | "completed";
}

// other model types...
