import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "ຊື່ສິນຄ້າຫ້າມວ່າງເປົ່າ"),
    price: z.number().positive("ລາຄາຕ້ອງຫລາຍກວ່າ 0"),
    description: z.string().optional(),
    stock: z.number().int().nonnegative().optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1, "ຊື່ສິນຄ້າຫ້າມວ່າງເປົ່າ"),
    price: z.number().positive("ລາຄາຕ້ອງຫລາຍກວ່າ 0"),
    description: z.string().optional(),
    stock: z.number().int().nonnegative().optional(),
});


export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

