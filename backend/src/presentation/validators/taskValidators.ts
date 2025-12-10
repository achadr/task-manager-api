import { z } from "zod";

// Custom date validator for ISO 8601 format
const dateStringSchema = z
  .string()
  .datetime({ message: "Date must be in ISO 8601 format (e.g., 2024-01-15T10:30:00Z)" })
  .refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    },
    { message: "Invalid date value" }
  );

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Description must be 500 characters or less"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.union([dateStringSchema, z.null()]).optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be 100 characters or less")
    .optional(),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Description must be 500 characters or less")
    .optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.union([dateStringSchema, z.null()]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;