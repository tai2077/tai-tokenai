# Pixel Agents Event Protocol

## Overview
This document outlines the strict communication interface established between the Pixel Agents Canvas environment and its managing React Host (e.g., TAI-402 Ops Interface).

## Core Transport
- Handled through `adapters/HostAdapter.ts`
- Web architecture utilizes custom window (`pixel-agents-outbound`) and `BroadcastChannel` events for sync.
- Extension equivalents run via matching `vscode.postMessage()`.

## Event Schemas (Inbound)
Handled via `EventSchema.ts` `PixelAgentsEventSchema` (Zod Parsed).

1. `settingsLoaded`: `{ soundEnabled: boolean }`
2. `characterSpritesLoaded`: `{ characters: CharacterSpriteDef[] }`
3. `floorTilesLoaded`: `{ sprites: TileSpriteDef[] }`
4. `wallTilesLoaded`: `{ sprites: TileSpriteDef[] }`
5. `furnitureAssetsLoaded`: `{ catalog: FurnitureCatalogItem[], sprites: FurnitureSpriteDef[] }`
6. `layoutLoaded`: `{ layout: OfficeLayout }`
7. `existingAgents`: `{ agents: Array<{ id: number; name: string; avatar: string; role: string; level: number; quote: string; status: AgentStatus; output: string }> }`
8. `agentCreated`: `{ id: number }`
9. `agentRemoved`: `{ id: number }`
10. `agentStatus`: `{ id: number; status: AgentStatus }`
11. `agentToolStart`: `{ id: number; toolId: string; status: string }`
12. `agentToolUpdate`: `{ id: number; toolId: string; status: string }`
13. `agentToolEnd`: `{ id: number; toolId: string; status: string }`
14. `agentNeedsPermission`: `{ id: number; requestId: string; message: string; requiresAudio: boolean }`
15. `agentPermissionResult`: `{ id: number; requestId: string; approved: boolean }`

## Event Schemas (Outbound)

1. `webviewReady`: Triggered on Mount (`PixelOfficeApp`).
2. `saveLayout`: Emits `layout` to host to sync to persistent storage (ex: localStorage).
3. `saveAgentSeats`: Emits specific custom assigned seating for agents (persisted per terminal session).
4. `playSound`: Forwards audio play requests outside the constrained UI element.
5. `resolvePermission`: Responds back with `requestId` and `approved` boolean.
6. `selectAgent`: Relays the selected agent's details payload to UI layers for external interaction.

## Fallback & Integrity Checks
All events run strictly through `validateEventPayload()` generating verbose console logging drop notifications upon receiving invalid payloads to maintain thread integrity.
