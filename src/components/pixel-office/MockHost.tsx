"use client";

import { useEffect } from "react";
import {
  createHostAdapter,
  type HostAdapterOptions,
} from "./adapters/HostAdapter";

const withDefined = <T extends object>(
  base: T,
  key: keyof T,
  value: string | undefined,
): T => {
  if (value !== undefined && value !== "") {
    (base as Record<string, unknown>)[key as string] = value;
  }
  return base;
};

const resolveHostAdapterOptions = (): HostAdapterOptions => {
  const mode = (import.meta.env.VITE_PIXEL_HOST_MODE ?? "mock").toLowerCase();

  if (mode === "remote") {
    let options: HostAdapterOptions = { type: "remote" };
    options = withDefined(options, "sseUrl", import.meta.env.VITE_PIXEL_HOST_SSE_URL);
    options = withDefined(
      options,
      "websocketUrl",
      import.meta.env.VITE_PIXEL_HOST_WEBSOCKET_URL,
    );
    options = withDefined(options, "outboundUrl", import.meta.env.VITE_PIXEL_HOST_OUTBOUND_URL);
    return options;
  }

  let options: HostAdapterOptions = { type: "mock" };
  options = withDefined(options, "preloadedPath", import.meta.env.VITE_PIXEL_PRELOADED_PATH);
  options = withDefined(
    options,
    "layoutStorageKey",
    import.meta.env.VITE_PIXEL_LAYOUT_STORAGE_KEY,
  );
  options = withDefined(
    options,
    "seatsStorageKey",
    import.meta.env.VITE_PIXEL_SEATS_STORAGE_KEY,
  );
  options.bootstrapDemoAgent = import.meta.env.VITE_PIXEL_BOOTSTRAP_DEMO_AGENT !== "false";
  return options;
};

export function MockHost() {
  useEffect(() => {
    const adapter = createHostAdapter(resolveHostAdapterOptions());
    adapter.start();
    return () => adapter.stop();
  }, []);

  return null;
}
