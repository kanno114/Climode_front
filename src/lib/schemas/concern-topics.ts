import { z } from "zod";

export const ConcernTopicSchema = z.object({
  key: z.string(),
  label_ja: z.string(),
  description_ja: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? ""),
  rule_concerns: z.array(z.string()),
});

export const ConcernTopicListSchema = z.array(ConcernTopicSchema);

export type ConcernTopic = z.infer<typeof ConcernTopicSchema>;
