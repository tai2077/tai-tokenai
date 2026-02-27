import { createMockHostAdapter } from "../host/mockHostAdapter";
import { createRemoteHostAdapter } from "../host/remoteHostAdapter";

export interface HostAdapterOptions {
    type: "mock" | "remote";
    // Mock options
    preloadedPath?: string;
    layoutStorageKey?: string;
    seatsStorageKey?: string;
    bootstrapDemoAgent?: boolean;
    // Remote options
    sseUrl?: string;
    websocketUrl?: string;
    outboundUrl?: string;
}

export interface PixelHostAdapter {
    start: () => void;
    stop: () => void;
}

export const createHostAdapter = (options: HostAdapterOptions): PixelHostAdapter => {
    if (options.type === "remote") {
        return createRemoteHostAdapter({
            sseUrl: options.sseUrl,
            websocketUrl: options.websocketUrl,
            outboundUrl: options.outboundUrl,
        });
    }

    // Default to mock
    return createMockHostAdapter({
        preloadedPath: options.preloadedPath,
        layoutStorageKey: options.layoutStorageKey,
        seatsStorageKey: options.seatsStorageKey,
        bootstrapDemoAgent: options.bootstrapDemoAgent,
    });
};
