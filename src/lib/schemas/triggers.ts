import { z } from "zod";

export const TriggerLevelSchema = z.object({
  id: z.string(),
  label: z.string(),
  threshold: z.number(),
  priority: z.number(),
});

export const TriggerRuleSchema = z
  .object({
    metric: z.string(),
    operator: z.string(),
    levels: z.array(TriggerLevelSchema),
  })
  .partial()
  .transform((rule) => {
    if (!rule) {
      return null;
    }

    return {
      metric: rule.metric ?? "",
      operator: rule.operator ?? "",
      levels: rule.levels ?? [],
    };
  });

export const TriggerSchema = z.object({
  id: z.number(),
  key: z.string(),
  label: z.string(),
  category: z.enum(["env", "body"]),
  is_active: z.boolean(),
  version: z.number(),
  rule: TriggerRuleSchema.nullish().transform((rule) => rule ?? null),
});

export const TriggerListSchema = z.array(TriggerSchema);

export const UserTriggerSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  trigger: TriggerSchema,
});

export const UserTriggerListSchema = z.array(UserTriggerSchema);

export type Trigger = z.infer<typeof TriggerSchema>;
export type TriggerRule = NonNullable<Trigger["rule"]>;
export type TriggerLevel = z.infer<typeof TriggerLevelSchema>;
export type UserTrigger = z.infer<typeof UserTriggerSchema>;
