import {
  postInboundMessage,
  subscribeOutboundMessages,
  type PixelAgentsMessage,
} from "./events";

interface MockHostAdapterOptions {
  preloadedPath?: string | undefined;
  layoutStorageKey?: string | undefined;
  seatsStorageKey?: string | undefined;
  bootstrapDemoAgent?: boolean | undefined;
}

interface PixelHostAdapter {
  start: () => void;
  stop: () => void;
}

const DEFAULT_LAYOUT = {
  version: 1,
  cols: 20,
  rows: 20,
  tiles: Array(20 * 20).fill(0),
  tileColors: Array(20 * 20).fill(null),
  furniture: [],
};

export const createMockHostAdapter = (
  options: MockHostAdapterOptions = {},
): PixelHostAdapter => {
  const preloadedPath = options.preloadedPath ?? "/pixel-agents/preloaded.json";
  const layoutStorageKey = options.layoutStorageKey ?? "pixel-agents-layout";
  const seatsStorageKey = options.seatsStorageKey ?? "pixel-agents-seats";
  const bootstrapDemoAgent = options.bootstrapDemoAgent ?? true;

  let unsubscribe: (() => void) | null = null;
  let ready = false;
  let channel: BroadcastChannel | null = null;

  const boot = async (): Promise<void> => {
    const response = await fetch(preloadedPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${preloadedPath}`);
    }

    const data = await response.json();
    postInboundMessage({ type: "settingsLoaded", soundEnabled: false });
    postInboundMessage({ type: "characterSpritesLoaded", characters: data.characters });
    postInboundMessage({ type: "floorTilesLoaded", sprites: data.floors });
    postInboundMessage({ type: "wallTilesLoaded", sprites: data.walls });
    postInboundMessage({
      type: "furnitureAssetsLoaded",
      catalog: data.furnitureCatalog,
      sprites: data.furnitureSprites,
    });

    const saved = window.localStorage.getItem(layoutStorageKey);
    const layout = saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    postInboundMessage({ type: "layoutLoaded", layout });

    // Also load seats if any
    const savedSeats = window.localStorage.getItem(seatsStorageKey);
    if (savedSeats) {
      try {
        const parsedSeats = JSON.parse(savedSeats);
        // Note: PixelAgentsEventSchema does not strictly define inbound message for seats loading yet,
        // but if we needed we could dispatch it, or the state machine might just rely on fresh assignment.
      } catch (e) {
        console.error("Failed to parse seats", e);
      }
    }

    postInboundMessage({ type: "existingAgents", agents: [] });

    if (!bootstrapDemoAgent) {
      return;
    }

    window.setTimeout(() => {
      postInboundMessage({ type: "agentCreated", id: 1 });
      postInboundMessage({ type: "agentStatus", id: 1, status: "active" });
      window.setTimeout(() => {
        postInboundMessage({
          type: "agentToolStart",
          id: 1,
          toolId: "tool-1",
          status: "Typing code",
        });
      }, 2000);
    }, 1000);
  };

  const handleOutbound = async (message: PixelAgentsMessage): Promise<void> => {
    if (message.type === "webviewReady") {
      if (ready) {
        return;
      }
      ready = true;
      try {
        await boot();
      } catch (error) {
        console.error("[MockHostAdapter] boot failed:", error);
      }
      return;
    }

    if (message.type === "saveLayout") {
      window.localStorage.setItem(layoutStorageKey, JSON.stringify(message.layout));
      channel?.postMessage({ type: "layoutUpdated", layout: message.layout });
      return;
    }

    if (message.type === "saveAgentSeats") {
      window.localStorage.setItem(seatsStorageKey, JSON.stringify(message.seats));
      channel?.postMessage({ type: "seatsUpdated", seats: message.seats });
    }
  };

  return {
    start() {
      if (unsubscribe) {
        return;
      }

      channel = new BroadcastChannel("pixel-agents-sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "layoutUpdated" && event.data?.layout) {
          postInboundMessage({ type: "layoutLoaded", layout: event.data.layout });
        }
      };

      unsubscribe = subscribeOutboundMessages(handleOutbound);
    },
    stop() {
      unsubscribe?.();
      unsubscribe = null;
      ready = false;
      channel?.close();
      channel = null;
    },
  };
};
