import { z } from "zod";

export const productSchema = z.object({
  product_name: z.string().min(3, "Ürün adı en az 3 karakter olmalı"),
  category_id: z
    .number({ message: "Kategori seçmelisiniz" })
    .min(1, "Kategori seçmelisiniz"),
  unit_price: z.coerce.number().positive("Fiyat 0'dan büyük olmalı"),
  units_in_stock: z
    .string()
    .min(1, "Stok adedi zorunludur")
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), { message: "Stok tam sayı olmalı" })
    .refine((val) => val >= 0, { message: "Stok negatif olamaz" }),
  });

export type ProductFormValues = z.infer<typeof productSchema>;