import {
  dispatchOutboundMessage,
  postInboundMessage,
  type PixelAgentsMessage,
} from "./events";

interface RemoteHostAdapterOptions {
  sseUrl?: string | undefined;
  websocketUrl?: string | undefined;
  outboundUrl?: string | undefined;
}

interface PixelHostAdapter {
  start: () => void;
  stop: () => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toInboundMessage = (value: unknown): PixelAgentsMessage | null => {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null;
  }
  return value as PixelAgentsMessage;
};

export const createRemoteHostAdapter = (
  options: RemoteHostAdapterOptions,
): PixelHostAdapter => {
  let eventSource: EventSource | null = null;
  let socket: WebSocket | null = null;
  let outboundAbort: AbortController | null = null;

  const handleInboundPayload = (value: unknown) => {
    const message = toInboundMessage(value);
    if (!message) {
      return;
    }
    postInboundMessage(message);
  };

  const startSse = () => {
    if (!options.sseUrl || eventSource) {
      return;
    }
    eventSource = new EventSource(options.sseUrl);
    eventSource.onmessage = (event) => {
      try {
        handleInboundPayload(JSON.parse(event.data));
      } catch (error) {
        console.warn("[RemoteHostAdapter] invalid SSE payload", error);
      }
    };
  };

  const startSocket = () => {
    if (!options.websocketUrl || socket) {
      return;
    }
    socket = new WebSocket(options.websocketUrl);
    socket.onmessage = (event) => {
      try {
        handleInboundPayload(JSON.parse(event.data));
      } catch (error) {
        console.warn("[RemoteHostAdapter] invalid websocket payload", error);
      }
    };
  };

  const sendOutbound = (message: PixelAgentsMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return;
    }

    if (!options.outboundUrl) {
      return;
    }

    outboundAbort?.abort();
    outboundAbort = new AbortController();
    void fetch(options.outboundUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(message),
      signal: outboundAbort.signal,
    }).catch((error) => {
      console.warn("[RemoteHostAdapter] outbound send failed", error);
    });
  };

  const outboundProxy = (event: Event) => {
    const custom = event as CustomEvent<unknown>;
    const message = toInboundMessage(custom.detail);
    if (!message) {
      return;
    }
    sendOutbound(message);
  };

  return {
    start() {
      startSse();
      startSocket();
      window.addEventListener("pixel-agents-outbound", outboundProxy);
      // Notify app it's attached to a remote host.
      dispatchOutboundMessage({ type: "webviewReady" });
    },
    stop() {
      eventSource?.close();
      socket?.close();
      outboundAbort?.abort();
      eventSource = null;
      socket = null;
      outboundAbort = null;
      window.removeEventListener("pixel-agents-outbound", outboundProxy);
    },
  };
};
