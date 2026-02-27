import { z } from "zod";

const NumericIdSchema = z.number();

const LayoutSchema = z
  .object({
    version: z.number(),
    cols: z.number(),
    rows: z.number(),
    tiles: z.array(z.number()),
    furniture: z.array(z.any()),
    tileColors: z.array(z.any()).optional(),
  })
  .passthrough();

const AgentSeatSchema = z.object({
  palette: z.number(),
  hueShift: z.number(),
  seatId: z.union([z.string(), z.null()]),
});

export const BaseMessageSchema = z
  .object({
    type: z.string(),
  })
  .passthrough();

export const LayoutLoadedSchema = z.object({
  type: z.literal("layoutLoaded"),
  layout: z.union([LayoutSchema, z.null()]),
});

export const ExistingAgentsSchema = z.object({
  type: z.literal("existingAgents"),
  agents: z.array(NumericIdSchema),
  agentMeta: z
    .record(
      z.string(),
      z.object({
        palette: z.number().optional(),
        hueShift: z.number().optional(),
        seatId: z.string().optional(),
      }),
    )
    .optional(),
});

export const AgentCreatedSchema = z.object({
  type: z.literal("agentCreated"),
  id: NumericIdSchema,
});

export const AgentClosedSchema = z.object({
  type: z.literal("agentClosed"),
  id: NumericIdSchema,
});

export const AgentSelectedSchema = z.object({
  type: z.literal("agentSelected"),
  id: NumericIdSchema,
});

export const AgentStatusSchema = z.object({
  type: z.literal("agentStatus"),
  id: NumericIdSchema,
  status: z.string(),
});

export const AgentToolStartSchema = z.object({
  type: z.literal("agentToolStart"),
  id: NumericIdSchema,
  toolId: z.string(),
  status: z.string(),
});

export const AgentToolDoneSchema = z.object({
  type: z.literal("agentToolDone"),
  id: NumericIdSchema,
  toolId: z.string(),
});

export const AgentToolPermissionSchema = z.object({
  type: z.literal("agentToolPermission"),
  id: NumericIdSchema,
  toolId: z.string().optional(),
  message: z.string().optional(),
});

export const AgentToolPermissionClearSchema = z.object({
  type: z.literal("agentToolPermissionClear"),
  id: NumericIdSchema,
  toolId: z.string().optional(),
});

export const SubagentToolPermissionSchema = z.object({
  type: z.literal("subagentToolPermission"),
  id: NumericIdSchema,
  parentToolId: z.string(),
});

export const SubagentToolStartSchema = z.object({
  type: z.literal("subagentToolStart"),
  id: NumericIdSchema,
  parentToolId: z.string(),
  toolId: z.string(),
  status: z.string(),
});

export const SubagentToolDoneSchema = z.object({
  type: z.literal("subagentToolDone"),
  id: NumericIdSchema,
  parentToolId: z.string(),
  toolId: z.string(),
});

export const SubagentClearSchema = z.object({
  type: z.literal("subagentClear"),
  id: NumericIdSchema,
  parentToolId: z.string(),
});

export const AgentToolsClearSchema = z.object({
  type: z.literal("agentToolsClear"),
  id: NumericIdSchema,
});

export const SettingsLoadedSchema = z.object({
  type: z.literal("settingsLoaded"),
  soundEnabled: z.boolean(),
});

export const CharacterSpritesLoadedSchema = z.object({
  type: z.literal("characterSpritesLoaded"),
  characters: z.array(z.any()),
});

export const FloorTilesLoadedSchema = z.object({
  type: z.literal("floorTilesLoaded"),
  sprites: z.array(z.any()),
});

export const WallTilesLoadedSchema = z.object({
  type: z.literal("wallTilesLoaded"),
  sprites: z.array(z.any()),
});

export const FurnitureAssetsLoadedSchema = z.object({
  type: z.literal("furnitureAssetsLoaded"),
  catalog: z.array(z.any()),
  sprites: z.record(z.string(), z.any()),
});

export const WebviewReadySchema = z.object({
  type: z.literal("webviewReady"),
});

export const SaveLayoutSchema = z.object({
  type: z.literal("saveLayout"),
  layout: LayoutSchema.or(z.record(z.string(), z.any())),
});

export const SaveAgentSeatsSchema = z.object({
  type: z.literal("saveAgentSeats"),
  seats: z.record(z.string(), AgentSeatSchema),
});

export const FocusAgentSchema = z.object({
  type: z.literal("focusAgent"),
  id: NumericIdSchema,
});

export const CloseAgentSchema = z.object({
  type: z.literal("closeAgent"),
  id: NumericIdSchema,
});

export const OpenClaudeSchema = z.object({
  type: z.literal("openClaude"),
});

export const OpenSessionsFolderSchema = z.object({
  type: z.literal("openSessionsFolder"),
});

export const ExportLayoutSchema = z.object({
  type: z.literal("exportLayout"),
});

export const ImportLayoutSchema = z.object({
  type: z.literal("importLayout"),
});

export const SetSoundEnabledSchema = z.object({
  type: z.literal("setSoundEnabled"),
  enabled: z.boolean(),
});

const EVENT_SCHEMA_BY_TYPE = {
  layoutLoaded: LayoutLoadedSchema,
  existingAgents: ExistingAgentsSchema,
  agentCreated: AgentCreatedSchema,
  agentClosed: AgentClosedSchema,
  agentSelected: AgentSelectedSchema,
  agentStatus: AgentStatusSchema,
  agentToolStart: AgentToolStartSchema,
  agentToolDone: AgentToolDoneSchema,
  agentToolPermission: AgentToolPermissionSchema,
  agentToolPermissionClear: AgentToolPermissionClearSchema,
  agentToolsClear: AgentToolsClearSchema,
  subagentToolPermission: SubagentToolPermissionSchema,
  subagentToolStart: SubagentToolStartSchema,
  subagentToolDone: SubagentToolDoneSchema,
  subagentClear: SubagentClearSchema,
  settingsLoaded: SettingsLoadedSchema,
  characterSpritesLoaded: CharacterSpritesLoadedSchema,
  floorTilesLoaded: FloorTilesLoadedSchema,
  wallTilesLoaded: WallTilesLoadedSchema,
  furnitureAssetsLoaded: FurnitureAssetsLoadedSchema,
  webviewReady: WebviewReadySchema,
  saveLayout: SaveLayoutSchema,
  saveAgentSeats: SaveAgentSeatsSchema,
  focusAgent: FocusAgentSchema,
  closeAgent: CloseAgentSchema,
  openClaude: OpenClaudeSchema,
  openSessionsFolder: OpenSessionsFolderSchema,
  exportLayout: ExportLayoutSchema,
  importLayout: ImportLayoutSchema,
  setSoundEnabled: SetSoundEnabledSchema,
} as const;

const KNOWN_SCHEMAS = Object.values(EVENT_SCHEMA_BY_TYPE);

export const PixelAgentsEventSchema = z.discriminatedUnion(
  "type",
  KNOWN_SCHEMAS as [
    (typeof KNOWN_SCHEMAS)[number],
    (typeof KNOWN_SCHEMAS)[number],
    ...(typeof KNOWN_SCHEMAS)[number][],
  ],
);

export type PixelAgentsMessage = z.infer<typeof BaseMessageSchema>;
export type PixelAgentsKnownEvent = z.infer<typeof PixelAgentsEventSchema>;

export const validateEventPayload = (payload: unknown): boolean => {
  const parsed = BaseMessageSchema.safeParse(payload);
  if (!parsed.success) {
    console.warn("[PixelAgents] Message missing required type field", payload);
    return false;
  }

  const schema = EVENT_SCHEMA_BY_TYPE[parsed.data.type as keyof typeof EVENT_SCHEMA_BY_TYPE];
  if (!schema) {
    // Unknown message types are allowed for forward-compatibility.
    return true;
  }

  const validated = schema.safeParse(payload);
  if (!validated.success) {
    console.warn(
      `[PixelAgents] Discarding invalid payload for type "${parsed.data.type}"`,
      validated.error.format(),
    );
    return false;
  }

  return true;
};
