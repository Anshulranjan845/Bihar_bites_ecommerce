import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),

  slug: z.string().min(2, "Slug is required"),

  description: z.string().optional(),

  image: z.string().optional(),
});
