import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().gt(0, "Price must be greater than 0"),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  categoryId: z.number().optional()
})

export type ProductFormSchema = z.infer<typeof productSchema>