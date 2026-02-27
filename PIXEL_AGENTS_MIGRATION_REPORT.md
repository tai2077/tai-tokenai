# Pixel Agents Migration Report

## Overview
This report documents the 1:1 migration and upgrade of the combat module (`/ops`) in the TAI-402 project to the new Pixel Agents Web Version. The migration was performed keeping strict backward compatibility, stability, and pixel-perfect design in mind.

## Architectural Changes

### 1. Asset Management & Directories
- Created `public/pixel-agents` directory to house 106+ 16x16 transparent PNG assets, maintaining strict catalog definitions (`furniture.catalog.json`, `characters.catalog.json`, `ui.catalog.json`).
- Added a `preloaded.json` manifest to bootstrap the loading process for all necessary assets in a single request.

### 2. Event & Protocol Standardization (HostAdapter)
- Implemented an abstract `HostAdapter` with `MockHostAdapter` and `RemoteHostAdapter` (SSE/WebSocket) to decouple the game engine loop from real-time data sources or VSCode extension hosts.
- Introduced `EventSchema.ts` utilizing `zod` for robust runtime validation of 15 incoming/outgoing message types, preventing malformed payloads from crashing the webview/canvas client.

### 3. Canvas Rendering & Scaler
- Enforced `imageSmoothingEnabled = false` across all rendering contexts, paired with fixed scale constraints (2x/3x/4x) to ensure crispy pixel art projection.
- Layered rendering stabilized in order: `Floor -> Wall -> Furniture (Back) -> Character -> Furniture (Front) -> UI Bubbles`.
- Added sprite caching to guarantee solid 60fps performance during dense operations.

### 4. Agent State Machine & Grid Pathfinding
- Completed Agent and Subagent lifecycle management. Subagents correctly link to a parent and despawn gracefully.
- Upgraded the Breadth-First Search (BFS) algorithm to contain a fallback mechanism: if an agent's destination is unreachable (blocked by furniture/walls), the path logic automatically falls back to finding the closest unobstructed tile to the target.

### 5. Pixel Editor Parity
- Fully implemented editor capabilities for painting tiles, placing/removing furniture, erasing, and sampling (eyedropper).
- Added complex properties like furniture orientation rotations and state toggles (e.g., turning a computer on/off).
- Enforced wall-mounted and desk-surface placement validation.
- Implemented an immutable-based 50-step Undo/Redo stack for robust layout modifications.
- Upgraded layout serialization/deserialization to be both forward and backward compatible with Legacy JSON layouts (converting old IDs to properly colored tiles).

### 6. Persistence & Feature Flags
- `PIXEL_OPS_ENABLED` toggle is enforced at `app/ops/page.tsx`: when enabled, `/ops` redirects to `/c2c/office`; when disabled, `/ops` serves the legacy Ops dashboard.
- Replaced non-existent `vscode` APIs with real `localStorage` saving implementations and added a `BroadcastChannel` to automatically sync layout and seating changes across multiple active browser tabs.

## Conclusion
The Pixel Agents application is successfully integrated into the existing Next.js / Vite build chain without disrupting other pages (`/market`, `/launch`, etc.).
