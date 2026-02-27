# Pixel Agents Event Protocol

## Overview
This document defines runtime messages between Pixel Office UI and host adapters.

## Transport
- Outbound: custom browser event `pixel-agents-outbound` (`vscode.postMessage` shim).
- Inbound: `window.postMessage`.
- Cross-tab sync: `BroadcastChannel("pixel-agents-sync")`.

## Inbound Events
- `settingsLoaded`: `{ soundEnabled: boolean }`
- `characterSpritesLoaded`: `{ characters: unknown[] }`
- `floorTilesLoaded`: `{ sprites: unknown[] }`
- `wallTilesLoaded`: `{ sprites: unknown[] }`
- `furnitureAssetsLoaded`: `{ catalog: unknown[]; sprites: Record<string, unknown> }`
- `layoutLoaded`: `{ layout: OfficeLayout | null }`
- `existingAgents`: `{ agents: number[]; agentMeta?: Record<string, { palette?: number; hueShift?: number; seatId?: string }> }`
- `agentCreated`: `{ id: number }`
- `agentClosed`: `{ id: number }`
- `agentSelected`: `{ id: number }`
- `agentStatus`: `{ id: number; status: string }`
- `agentToolStart`: `{ id: number; toolId: string; status: string }`
- `agentToolDone`: `{ id: number; toolId: string }`
- `agentToolsClear`: `{ id: number }`
- `agentToolPermission`: `{ id: number; toolId?: string; message?: string }`
- `agentToolPermissionClear`: `{ id: number; toolId?: string }`
- `subagentToolPermission`: `{ id: number; parentToolId: string }`
- `subagentToolStart`: `{ id: number; parentToolId: string; toolId: string; status: string }`
- `subagentToolDone`: `{ id: number; parentToolId: string; toolId: string }`
- `subagentClear`: `{ id: number; parentToolId: string }`

## Outbound Events
- `webviewReady`
- `saveLayout`: `{ layout: OfficeLayout | Record<string, unknown> }`
- `saveAgentSeats`: `{ seats: Record<string, { palette: number; hueShift: number; seatId: string | null }> }`
- `focusAgent`: `{ id: number }`
- `closeAgent`: `{ id: number }`
- `openClaude`
- `openSessionsFolder`
- `exportLayout`
- `importLayout`
- `setSoundEnabled`: `{ enabled: boolean }`

## Validation
- All inbound/outbound payloads pass `validateEventPayload()` in `src/components/pixel-office/schema/EventSchema.ts`.
- Unknown event types are allowed for forward compatibility.
- Known event types failing schema validation are dropped with warning logs.
