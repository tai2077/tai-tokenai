import type { SpriteData } from "../office/types";

export interface PreloadedAssetsPayload {
  characters?: unknown;
  floors?: unknown;
  walls?: unknown;
  furnitureCatalog?: unknown;
  furnitureSprites?: unknown;
  urls?: unknown;
}

interface FurnitureManifestEntry {
  id?: string;
  category?: string;
  state?: string;
  orientation?: string;
  footprint?: [number, number];
  size?: [number, number];
  file?: string;
}

interface NormalizedFurnitureAsset {
  id: string;
  name: string;
  label: string;
  category: "desks" | "chairs" | "storage" | "decor" | "electronics" | "wall" | "misc";
  file: string;
  width: number;
  height: number;
  footprintW: number;
  footprintH: number;
  isDesk: boolean;
  canPlaceOnWalls: boolean;
  orientation?: "front" | "back" | "left" | "right";
  state?: "on" | "off";
}

const FLOOR_TILE_FILES = [
  "/pixel-agents/tiles/floor/wood.png",
  "/pixel-agents/tiles/floor/tile_white.png",
  "/pixel-agents/tiles/floor/carpet_blue.png",
  "/pixel-agents/tiles/floor/carpet_red.png",
];

const WALL_TILE_FILES = [
  "/pixel-agents/tiles/wall/wall_top.png",
  "/pixel-agents/tiles/wall/wall_mid.png",
  "/pixel-agents/tiles/wall/wall_bottom.png",
  "/pixel-agents/tiles/wall/wall_corner.png",
];

const EMPTY_SPRITE: SpriteData = Array.from({ length: 16 }, () =>
  Array.from({ length: 16 }, () => ""),
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSprite = (value: unknown): value is SpriteData =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((row) => Array.isArray(row) && row.every((pixel) => typeof pixel === "string"));

const hasStructuredPayload = (payload: PreloadedAssetsPayload): boolean =>
  Array.isArray(payload.floors) &&
  payload.floors.every(isSprite) &&
  Array.isArray(payload.walls) &&
  payload.walls.every(isSprite) &&
  Array.isArray(payload.furnitureCatalog) &&
  isRecord(payload.furnitureSprites) &&
  Object.keys(payload.furnitureSprites).length > 0;

const toAssetPath = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;

const toHex = (value: number): string => value.toString(16).padStart(2, "0");

const titleCase = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

const toLabel = (id: string): string =>
  titleCase(
    id
      .replace(/^obj_/, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );

const toFurnitureCategory = (
  rawCategory: string | undefined,
): NormalizedFurnitureAsset["category"] => {
  switch (rawCategory) {
    case "electronics":
      return "electronics";
    case "decor":
      return "decor";
    case "doors":
    case "windows":
      return "wall";
    case "storage":
      return "storage";
    case "chairs":
      return "chairs";
    case "desks":
      return "desks";
    default:
      return "misc";
  }
};

const toOrientation = (
  rawOrientation: string | undefined,
): NormalizedFurnitureAsset["orientation"] | undefined => {
  switch (rawOrientation) {
    case "north":
    case "front":
      return "front";
    case "south":
    case "back":
      return "back";
    case "east":
    case "right":
      return "right";
    case "west":
    case "left":
      return "left";
    default:
      return undefined;
  }
};

const toState = (
  rawState: string | undefined,
): NormalizedFurnitureAsset["state"] | undefined => {
  if (rawState === "on" || rawState === "off") {
    return rawState;
  }
  return undefined;
};

const inferDeskById = (id: string, rawCategory: string | undefined): boolean => {
  if (rawCategory === "desks") {
    return true;
  }
  const match = id.match(/_(\d+)$/);
  if (!match) {
    return false;
  }
  const suffix = match[1];
  if (!suffix) {
    return false;
  }
  const index = Number.parseInt(suffix, 10);
  return rawCategory === "furniture" && Number.isFinite(index) && index >= 1 && index <= 6;
};

const readImage = (path: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Failed to decode sprite image at ${path}`));
    image.src = toAssetPath(path);
  });

const imageToSprite = (image: HTMLImageElement): SpriteData => {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2D canvas context is unavailable");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);

  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  const sprite: SpriteData = [];
  for (let row = 0; row < height; row += 1) {
    const pixelRow: string[] = [];
    for (let col = 0; col < width; col += 1) {
      const offset = (row * width + col) * 4;
      const alpha = data[offset + 3] ?? 0;
      if (alpha < 8) {
        pixelRow.push("");
        continue;
      }
      const red = data[offset] ?? 0;
      const green = data[offset + 1] ?? 0;
      const blue = data[offset + 2] ?? 0;
      pixelRow.push(`#${toHex(red)}${toHex(green)}${toHex(blue)}`);
    }
    sprite.push(pixelRow);
  }

  return sprite;
};

const loadSprite = async (path: string): Promise<SpriteData | null> => {
  try {
    const image = await readImage(path);
    return imageToSprite(image);
  } catch (error) {
    console.warn(`[PixelAssets] Failed to load sprite ${path}`, error);
    return null;
  }
};

const fetchJson = async <T>(path: string): Promise<T | null> => {
  const response = await fetch(path).catch(() => null);
  if (!response?.ok) {
    return null;
  }
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const isManifestEntry = (entry: unknown): entry is FurnitureManifestEntry =>
  isRecord(entry) && typeof entry.id === "string" && typeof entry.file === "string";

const toFurnitureAsset = (entry: FurnitureManifestEntry): NormalizedFurnitureAsset | null => {
  if (typeof entry.id !== "string" || typeof entry.file !== "string") {
    return null;
  }

  const width = Array.isArray(entry.size) ? Math.max(1, entry.size[0] ?? 16) : 16;
  const height = Array.isArray(entry.size) ? Math.max(1, entry.size[1] ?? 16) : 16;
  const footprintW = Array.isArray(entry.footprint)
    ? Math.max(1, entry.footprint[0] ?? 1)
    : Math.max(1, Math.round(width / 16));
  const footprintH = Array.isArray(entry.footprint)
    ? Math.max(1, entry.footprint[1] ?? 1)
    : Math.max(1, Math.round(height / 16));

  const category = toFurnitureCategory(entry.category);

  const normalized: NormalizedFurnitureAsset = {
    id: entry.id,
    name: entry.id,
    label: toLabel(entry.id),
    category,
    file: toAssetPath(entry.file),
    width,
    height,
    footprintW,
    footprintH,
    isDesk: inferDeskById(entry.id, entry.category),
    canPlaceOnWalls: entry.category === "doors" || entry.category === "windows",
  };

  const orientation = toOrientation(entry.orientation);
  if (orientation) {
    normalized.orientation = orientation;
  }

  const state = toState(entry.state);
  if (state) {
    normalized.state = state;
  }

  return normalized;
};

const buildWallsFromFourTiles = (tiles: SpriteData[]): SpriteData[] => {
  const top = tiles[0] ?? tiles[1] ?? tiles[2] ?? tiles[3] ?? EMPTY_SPRITE;
  const mid = tiles[1] ?? tiles[0] ?? tiles[2] ?? tiles[3] ?? EMPTY_SPRITE;
  const bottom = tiles[2] ?? tiles[1] ?? tiles[0] ?? tiles[3] ?? EMPTY_SPRITE;
  const corner = tiles[3] ?? mid ?? top ?? bottom ?? EMPTY_SPRITE;

  const result: SpriteData[] = [];
  for (let mask = 0; mask < 16; mask += 1) {
    const hasNorth = (mask & 1) !== 0;
    const hasEast = (mask & 2) !== 0;
    const hasSouth = (mask & 4) !== 0;
    const hasWest = (mask & 8) !== 0;

    if ((hasEast || hasWest) && !(hasNorth && hasSouth)) {
      result.push(corner);
      continue;
    }
    if (hasNorth && hasSouth) {
      result.push(mid);
      continue;
    }
    if (hasNorth && !hasSouth) {
      result.push(bottom);
      continue;
    }
    if (!hasNorth && hasSouth) {
      result.push(top);
      continue;
    }
    result.push(mid);
  }
  return result;
};

const decodeFloors = async (): Promise<SpriteData[]> => {
  const sprites = await Promise.all(FLOOR_TILE_FILES.map((file) => loadSprite(file)));
  return sprites.filter((sprite): sprite is SpriteData => sprite !== null);
};

const decodeWalls = async (): Promise<SpriteData[]> => {
  const tiles = await Promise.all(WALL_TILE_FILES.map((file) => loadSprite(file)));
  const available = tiles.filter((sprite): sprite is SpriteData => sprite !== null);
  if (available.length === 0) {
    return [];
  }
  if (available.length >= 16) {
    return available.slice(0, 16);
  }
  return buildWallsFromFourTiles(available);
};

const decodeFurnitureFromManifest = async (): Promise<{
  catalog: NormalizedFurnitureAsset[];
  sprites: Record<string, SpriteData>;
}> => {
  const manifest = await fetchJson<unknown>("/pixel-agents/manifests/furniture.catalog.json");
  const entries = Array.isArray(manifest) ? manifest.filter(isManifestEntry) : [];

  const catalog: NormalizedFurnitureAsset[] = [];
  const sprites: Record<string, SpriteData> = {};

  for (const entry of entries) {
    const asset = toFurnitureAsset(entry);
    if (!asset) {
      continue;
    }
    const sprite = await loadSprite(asset.file);
    if (!sprite) {
      continue;
    }
    catalog.push(asset);
    sprites[asset.id] = sprite;
  }

  return { catalog, sprites };
};

const decodeFurnitureFromUrls = async (urls: string[]): Promise<{
  catalog: NormalizedFurnitureAsset[];
  sprites: Record<string, SpriteData>;
}> => {
  const assetUrls = urls
    .map((url) => toAssetPath(url))
    .filter((url) => url.includes("/pixel-agents/objects/"));

  const catalog: NormalizedFurnitureAsset[] = [];
  const sprites: Record<string, SpriteData> = {};

  for (const file of assetUrls) {
    const id = file.split("/").pop()?.replace(/\.png$/i, "");
    if (!id) {
      continue;
    }
    const rawCategory = file.includes("/electronics/")
      ? "electronics"
      : file.includes("/decor/")
        ? "decor"
        : file.includes("/doors/")
          ? "doors"
          : file.includes("/windows/")
            ? "windows"
            : "furniture";

    const asset = toFurnitureAsset({
      id,
      category: rawCategory,
      file,
      footprint: [1, 1],
      size: [16, 16],
      state: "default",
      orientation: "north",
    });
    if (!asset) {
      continue;
    }
    const sprite = await loadSprite(file);
    if (!sprite) {
      continue;
    }
    catalog.push(asset);
    sprites[id] = sprite;
  }

  return { catalog, sprites };
};

export const remapLegacyFurnitureTypes = (
  legacyType: string,
): string => {
  const map: Record<string, string> = {
    desk: "obj_furniture_1",
    bookshelf: "obj_furniture_2",
    chair: "obj_furniture_3",
    plant: "obj_decor_1",
    whiteboard: "obj_decor_2",
    cooler: "obj_electronics_1",
    pc: "obj_electronics_2",
    lamp: "obj_electronics_3",
  };
  return map[legacyType] ?? legacyType;
};

export const resolvePreloadedAssets = async (
  payload: PreloadedAssetsPayload,
): Promise<PreloadedAssetsPayload> => {
  if (hasStructuredPayload(payload)) {
    return payload;
  }

  const floorsPromise = decodeFloors();
  const wallsPromise = decodeWalls();

  const fromManifest = await decodeFurnitureFromManifest();
  const fromUrls =
    fromManifest.catalog.length === 0 &&
    fromManifest.sprites &&
    Array.isArray(payload.urls)
      ? await decodeFurnitureFromUrls(
        payload.urls.filter((entry): entry is string => typeof entry === "string"),
      )
      : { catalog: [] as NormalizedFurnitureAsset[], sprites: {} as Record<string, SpriteData> };

  const floors = await floorsPromise;
  const walls = await wallsPromise;

  const furnitureCatalog =
    fromManifest.catalog.length > 0 ? fromManifest.catalog : fromUrls.catalog;
  const furnitureSprites =
    Object.keys(fromManifest.sprites).length > 0 ? fromManifest.sprites : fromUrls.sprites;

  return {
    ...payload,
    floors,
    walls,
    furnitureCatalog,
    furnitureSprites,
  };
};
