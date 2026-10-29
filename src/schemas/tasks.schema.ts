import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().nullable(),
    done: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const taskIdSchema = z.object({
  id: z.string().uuid(),
});

export const userTasksParamsSchema = z.object({
  userId: z.string().uuid(),
});

export const listTasksQuerySchema = z.object({
  done: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
});
