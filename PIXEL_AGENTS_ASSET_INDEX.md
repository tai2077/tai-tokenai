# Pixel Agents Asset Index

## Directory Structure
`public/pixel-agents/`
The primary asset delivery directory contains strictly 16x16 transparent PNGs and JSON definitions.

## Catalogs

### `preloaded.json`
Contains references to initial characters, floor options, wall options, and the general furniture catalog to efficiently preload assets before engine initialization.

### `furniture.catalog.json` & Categories
- **Chairs**: Desk chairs, couches, stools. Include varying `orientation` (up, down, left, right).
- **Desks**: Primary workstations. Determine Z-index rendering logic for items placed on top.
- **Surface Items**: Keyboards, computers, monitors. Placed `canPlaceOnSurfaces=true`.
- **Wall Items**: Whiteboards, posters, calendars. Target `wall` footprints.
- **Appliances & Decor**: Coolers, plants, bookshelves.

### `characters.catalog.json`
Defines agent baseline sprites along with specific subagent variants. Character sprites contain multiple frames for Idle, Walk, and Typing loops.

### `ui.catalog.json`
Defines 9-slice grid patches for UI bubbles, chat dialogues, heart icons, permission bubbles, and interaction prompts.

## Render Rules
- Pixel exact 16x16 slices.
- Strict mapping without antialiasing (`imageSmoothingEnabled = false`).
- All coordinates defined by top-left bounds except specific anchor overrides.
