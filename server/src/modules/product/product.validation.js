import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name is required"),

  slug: z.string().min(2, "Slug is required"),

  description: z.string().optional(),

  price: z.number().positive(),

  stock: z.number().int().nonnegative(),

  image: z.string().optional(),

  isFeatured: z.boolean().optional(),

  isAvailable: z.boolean().optional(),

  categoryId: z.string(),
});
