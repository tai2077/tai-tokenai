import {
  postInboundMessage,
  subscribeOutboundMessages,
  type PixelAgentsMessage,
} from "./events";
import type { OfficeLayout } from "../office/types";
import {
  createDefaultLayout,
  deserializeLayout,
} from "../office/layout/layoutSerializer";

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

interface PreloadedAssetsPayload {
  characters?: unknown;
  floors?: unknown;
  walls?: unknown;
  furnitureCatalog?: unknown;
  furnitureSprites?: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toParsedLayout = (value: unknown): OfficeLayout | null => {
  if (!isRecord(value)) {
    return null;
  }
  try {
    return deserializeLayout(JSON.stringify(value));
  } catch {
    return null;
  }
};

const readLayoutFromStorage = (layoutStorageKey: string): OfficeLayout => {
  const saved = window.localStorage.getItem(layoutStorageKey);
  if (!saved) {
    return createDefaultLayout();
  }

  const parsed = deserializeLayout(saved);
  return parsed ?? createDefaultLayout();
};

export const createMockHostAdapter = (
  options: MockHostAdapterOptions = {},
): PixelHostAdapter => {
  const preloadedPath =
    options.preloadedPath ?? "/pixel-agents/preloaded/preloaded.json";
  const layoutStorageKey = options.layoutStorageKey ?? "pixel-agents-layout";
  const seatsStorageKey = options.seatsStorageKey ?? "pixel-agents-seats";
  const bootstrapDemoAgent = options.bootstrapDemoAgent ?? true;

  let unsubscribe: (() => void) | null = null;
  let ready = false;
  let channel: BroadcastChannel | null = null;

  const boot = async (): Promise<void> => {
    let preloadedData: PreloadedAssetsPayload = {};
    const response = await fetch(preloadedPath).catch(() => null);
    if (!response?.ok) {
      console.warn(
        `[MockHostAdapter] Unable to load preloaded payload from ${preloadedPath}, using defaults.`,
      );
    } else {
      preloadedData = (await response.json().catch(() => ({}))) as PreloadedAssetsPayload;
    }

    postInboundMessage({ type: "settingsLoaded", soundEnabled: false });

    if (
      Array.isArray(preloadedData.characters) &&
      preloadedData.characters.length > 0
    ) {
      postInboundMessage({ type: "characterSpritesLoaded", characters: preloadedData.characters });
    }
    if (Array.isArray(preloadedData.floors) && preloadedData.floors.length > 0) {
      postInboundMessage({ type: "floorTilesLoaded", sprites: preloadedData.floors });
    }
    if (Array.isArray(preloadedData.walls) && preloadedData.walls.length > 0) {
      postInboundMessage({ type: "wallTilesLoaded", sprites: preloadedData.walls });
    }
    if (
      Array.isArray(preloadedData.furnitureCatalog) &&
      preloadedData.furnitureCatalog.length > 0 &&
      isRecord(preloadedData.furnitureSprites) &&
      Object.keys(preloadedData.furnitureSprites).length > 0
    ) {
      postInboundMessage({
        type: "furnitureAssetsLoaded",
        catalog: preloadedData.furnitureCatalog,
        sprites: preloadedData.furnitureSprites,
      });
    }

    const layout = readLayoutFromStorage(layoutStorageKey);
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
          const parsedLayout = toParsedLayout(event.data.layout);
          postInboundMessage({
            type: "layoutLoaded",
            layout: parsedLayout ?? createDefaultLayout(),
          });
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
