import { validateEventPayload } from "../schema/EventSchema";

export interface PixelAgentsMessage {
  type: string;
  [key: string]: unknown;
}

export const OUTBOUND_EVENT_NAME = "pixel-agents-outbound";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isPixelAgentsMessage = (value: unknown): value is PixelAgentsMessage =>
  isRecord(value) && typeof value.type === "string";

export const postInboundMessage = (message: PixelAgentsMessage): void => {
  if (typeof window === "undefined") {
    return;
  }
  if (!validateEventPayload(message)) {
    return; // Drop invalid payload
  }
  window.postMessage(message, "*");
};

export const dispatchOutboundMessage = (message: PixelAgentsMessage): void => {
  if (typeof window === "undefined") {
    return;
  }
  if (!validateEventPayload(message)) {
    return; // Drop invalid payload
  }
  window.dispatchEvent(new CustomEvent(OUTBOUND_EVENT_NAME, { detail: message }));
};

export const subscribeOutboundMessages = (
  handler: (message: PixelAgentsMessage) => void | Promise<void>,
): (() => void) => {
  if (typeof window === "undefined") {
    return () => { };
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<unknown>;
    if (!isPixelAgentsMessage(customEvent.detail)) {
      return;
    }
    // Validation happened at dispatch, but we can do it again just in case
    void handler(customEvent.detail);
  };

  window.addEventListener(OUTBOUND_EVENT_NAME, listener);
  return () => window.removeEventListener(OUTBOUND_EVENT_NAME, listener);
};
