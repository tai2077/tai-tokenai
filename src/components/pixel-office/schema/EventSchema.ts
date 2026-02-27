import { z } from "zod";

// Base Message
export const BaseMessageSchema = z.object({
    type: z.string(),
}).passthrough();

// 1. layoutLoaded
export const LayoutLoadedSchema = z.object({
    type: z.literal("layoutLoaded"),
    layout: z.object({
        version: z.number().optional(),
        cols: z.number(),
        rows: z.number(),
        tileColors: z.array(z.string()).optional(),
        floorTiles: z.array(z.number()),
        wallTiles: z.array(z.number()),
        furniture: z.array(z.any()),
    }),
});

// 2. existingAgents
export const ExistingAgentsSchema = z.object({
    type: z.literal("existingAgents"),
    agents: z.array(z.any()),
});

// 3. agentCreated
export const AgentCreatedSchema = z.object({
    type: z.literal("agentCreated"),
    id: z.union([z.string(), z.number()]),
});

// 4. agentClosed
export const AgentClosedSchema = z.object({
    type: z.literal("agentClosed"),
    id: z.union([z.string(), z.number()]),
});

// 5. agentSelected
export const AgentSelectedSchema = z.object({
    type: z.literal("agentSelected"),
    id: z.union([z.string(), z.number()]),
});

// 6. agentStatus
export const AgentStatusSchema = z.object({
    type: z.literal("agentStatus"),
    id: z.union([z.string(), z.number()]),
    status: z.string(),
});

// 7. agentToolStart
export const AgentToolStartSchema = z.object({
    type: z.literal("agentToolStart"),
    id: z.union([z.string(), z.number()]),
    toolId: z.string(),
    status: z.string().optional(),
});

// 8. agentToolDone
export const AgentToolDoneSchema = z.object({
    type: z.literal("agentToolDone"),
    id: z.union([z.string(), z.number()]),
    toolId: z.string(),
    result: z.any().optional(),
});

// 9. agentToolPermission
export const AgentToolPermissionSchema = z.object({
    type: z.literal("agentToolPermission"),
    id: z.union([z.string(), z.number()]),
    toolId: z.string(),
    message: z.string().optional(),
});

// 10. agentToolPermissionClear
export const AgentToolPermissionClearSchema = z.object({
    type: z.literal("agentToolPermissionClear"),
    id: z.union([z.string(), z.number()]),
    toolId: z.string(),
});

// 11. subagentToolStart
export const SubagentToolStartSchema = z.object({
    type: z.literal("subagentToolStart"),
    id: z.union([z.string(), z.number()]),
    parentId: z.union([z.string(), z.number()]),
    toolId: z.string(),
    status: z.string().optional(),
});

// 12. subagentToolDone
export const SubagentToolDoneSchema = z.object({
    type: z.literal("subagentToolDone"),
    id: z.union([z.string(), z.number()]),
    parentId: z.union([z.string(), z.number()]),
    toolId: z.string(),
    result: z.any().optional(),
});

// 13. subagentClear
export const SubagentClearSchema = z.object({
    type: z.literal("subagentClear"),
    id: z.union([z.string(), z.number()]),
});

// 14. saveLayout
export const SaveLayoutSchema = z.object({
    type: z.literal("saveLayout"),
    layout: z.any(),
});

// 15. saveAgentSeats
export const SaveAgentSeatsSchema = z.object({
    type: z.literal("saveAgentSeats"),
    seats: z.record(z.string(), z.number()),
});

export const PixelAgentsEventSchema = z.discriminatedUnion("type", [
    LayoutLoadedSchema,
    ExistingAgentsSchema,
    AgentCreatedSchema,
    AgentClosedSchema,
    AgentSelectedSchema,
    AgentStatusSchema,
    AgentToolStartSchema,
    AgentToolDoneSchema,
    AgentToolPermissionSchema,
    AgentToolPermissionClearSchema,
    SubagentToolStartSchema,
    SubagentToolDoneSchema,
    SubagentClearSchema,
    SaveLayoutSchema,
    SaveAgentSeatsSchema,
]);

// Keep this type inference for backward compatibility
export type PixelAgentsMessage = z.infer<typeof BaseMessageSchema>;
export type PixelAgentsKnownEvent = z.infer<typeof PixelAgentsEventSchema>;

/**
 * Validates any incoming raw object against the known schema event types.
 * Returns true if the event has passed validation, false if invalid, or undefined if it's an unhandled but generally okay type (fallback passthrough)
 */
export const validateEventPayload = (payload: unknown): boolean => {
    const baseParsing = BaseMessageSchema.safeParse(payload);
    if (!baseParsing.success) {
        console.warn("[PixelAgents] Received payload without 'type' field:", payload);
        return false;
    }

    const { type } = baseParsing.data;
    const knownTypes = [
        "layoutLoaded", "existingAgents", "agentCreated", "agentClosed", "agentSelected",
        "agentStatus", "agentToolStart", "agentToolDone", "agentToolPermission",
        "agentToolPermissionClear", "subagentToolStart", "subagentToolDone", "subagentClear",
        "saveLayout", "saveAgentSeats"
    ];

    if (knownTypes.includes(type)) {
        const parseResult = PixelAgentsEventSchema.safeParse(payload);
        if (!parseResult.success) {
            console.warn(`[PixelAgents] Discarding invalid payload for event type '${type}':`, parseResult.error.format());
            return false;
        }
    }

    return true;
};
