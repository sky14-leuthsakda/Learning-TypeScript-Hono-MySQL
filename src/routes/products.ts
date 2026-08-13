import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import type { Variables } from "../types.js";
import { createProductSchema, updateProductSchema } from "../schemas/product.js";
import * as productService from "../services/product.service.js";

const productRoutes = new Hono<{ Variables: Variables }>();

productRoutes.get("/", async (c) => {
    const products = await productService.getAllProducts();
    return c.json({
        success: true,
        message: "ດຶງລາຍການສິນຄ້າສຳເລັດ",
        data: products,
    });
});

productRoutes.get("/:id", async (c) => {
    const id = c.req.param("id");
    const product = await productService.getProductById(id);
    return c.json({
        success: true,
        data: product
    });
});

productRoutes.post("/", authMiddleware, async (c) => {
    const body = await c.req.json();
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400
        );
    }

    const newProduct = await productService.createNewProduct(validation.data);
    return c.json({
        success: true,
        message: "ສ້າງສິນຄ້າສຳເລັດ",
        data: newProduct
    }, 201
    );
});

productRoutes.put("/:id", authMiddleware, async (c) => {
    const id = c.req.param("id");
    
    if (!id) {
        return c.json({
            succes: false,
            message: "ຕ້ອງລະບຸ ID"
        },
        400
      );
    }

    const body = await c.req.json();
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400
      );
    }

    const updated = await productService.updateExistingProduct(id, validation.data);
    return c.json({
        success: true,
        message: `ແກ້ໄຂສິນຄ້າ ID: ${id} ສຳເລັດ`, data: updated
    });
});


productRoutes.delete("/:id", authMiddleware, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບູ ID"
        }, 400
      );
    }

    await productService.deleteExistingProduct(id);
    return c.json({
        success: true,
        message: `ລຶບສິນຄ້າ ID: ${id}ສຳເລັດ`
    });
});

export default productRoutes;





// productRoutes.get("/", async (c) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM products");
//     return c.json({
//       success: true,
//       message: "ດຶງລາຍການສິນຄ້າສຳເລັດ",
//       data: rows,
//     });
//   } catch (error) {
//     console.error("Database error:", error);
//     return c.json(
//       { success: false, message: "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່ພາຍຫຼັງ" },
//       500
//     );
//   }
// });

// productRoutes.get("/:id", async (c) => {
//     const id = c.req.param("id");
//     const [rows] = await pool.query<any[]>(
//         "SELECT * FROM products WHERE id = ?", [id]
//     );

//     if (rows.length === 0) {
//         throw new AppError(`ບໍ່ພົບສິນຄ້າ ID: ${id}`, 404);
//     }

//     return c.json({
//         success: true,
//         data: rows[0],
//     });
// });


// productRoutes.post("/", authMiddleware, async (c) => {
//     const user = c.get("user");
//     console.log("ຄົນທີ່ສ້າງ:", user);

//     const body = await c.req.json();
//     const validation = createProductSchema.safeParse(body);

//     if (!validation.success) {
//         return c.json(
//             {
//                 success: false,
//                 message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
//                 errors: validation.error.issues,
//             },
//             400
//         );
//     }

//     const data = validation.data;

//     const [result] = await pool.query<any>(
//         "INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)",
//         [data.name, data.price, data.description ?? null, data.stock ?? 0]
//     );

//     return c.json({
//         success: true,
//         message: "ສ້າງສິນຄ້າສຳເລັດ",
//         data: {
//             id: result.insertId,
//             name: data.name,
//             price: data.price,
//         },
//      },
//     201
//     );
// });

// productRoutes.put("/:id", authMiddleware, async (c) => {
//     const user = c.get("user");
//     console.log("ຄົນທີ່ແກ້ໄຂ:", user);

//     const id = c.req.param("id");
//     const body = await c.req.json();
//     const validation = updateProductSchema.safeParse(body);

//     if (!validation.success) {
//         return c.json(
//             {
//                 success: false,
//                 message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
//                 errors: validation.error.issues,
//             },
//             400
//         );
//     }

//     const data = validation.data;

//     const [result] = await pool.query<any>(
//         "UPDATE products SET name = ?, price = ?, description = ?, stock = ? WHERE id = ?",
//         [data.name, data.price, data.description ?? null, data.stock ?? 0, id]
//     );

//     if (result.affectedRows === 0) {
//         return c.json(
//             {
//                 success: false, 
//                 message: `ບໍ່ພົບສິນຄ້າ ID: ${id}`
//             },
//             404
//         );
//     }

//     return c.json({
//             success: true,
//             message: `ແກ້ໄຂສິນຄ້າ ID: ${id}`,
//             data: { id: Number(id), ...data},
//         });
// });

// productRoutes.delete("/:id", authMiddleware, async (c) => {
//     const id = c.req.param("id");
//     const user = c.get("user");
//     console.log("ຄົນທີ່ລຶບ:", user);

//     const [result] = await pool.query<any>(
//         "DELETE FROM products WHERE id = ?",
//          [id]
//     );

//     if (result.affectedRows === 0) {
//         return c.json(
//             {
//                 success: false,
//                 message: `ບໍ່ພົບສິນຄ້າ ID: ${id}`
//             },
//             404
//         );
//     }

//     return c.json({
//         success: true,
//         message: `ລຶບສິນຄ້າ ID: ${id} ສຳເລັດ`,
//     });
// });

// export default productRoutes;

