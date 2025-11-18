import { z } from "zod";

export const suggestionFeedbackSchema = z.object({
  key: z.string(),
  helpfulness: z.boolean().optional().nullable(),
});

// FormDataから来る文字列をパースするためのスキーマ
const suggestionFeedbacksSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  if (Array.isArray(val)) {
    return val;
  }
  return [];
}, z.array(suggestionFeedbackSchema).optional().default([]));

export const eveningReflectionSchema = z.object({
  note: z.string().optional().default(""),
  helpfulness: z.number().int().min(1).max(5).optional().nullable(),
  match_score: z.number().int().min(1).max(5).optional().nullable(),
  suggestion_feedbacks: suggestionFeedbacksSchema,
});

export type EveningReflectionFormData = z.infer<typeof eveningReflectionSchema>;
export type SuggestionFeedbackFormData = z.infer<
  typeof suggestionFeedbackSchema
>;
