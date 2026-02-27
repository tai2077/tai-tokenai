import {
  dispatchOutboundMessage,
  type PixelAgentsMessage,
} from "./host/events";

export const vscode = {
  postMessage: (message: PixelAgentsMessage) => {
    dispatchOutboundMessage(message);
  },
};
