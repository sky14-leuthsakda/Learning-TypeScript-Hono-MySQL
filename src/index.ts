import { Hono } from "hono";
import { serve } from "@hono/node-server";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import { AppError } from "./utils/AppError.js";

const app = new Hono();

app.use(async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    console.log(` ${c.req.method} ${c.req.path} - ${duration}`);
});

app.onError((err, c) => {
    console.error("🔥 Server Error:", err);

    if (err instanceof AppError) {
        return c.json({
            success: false,
            message: err.message
        }, err.statusCode as any);
    }

    return c.json(
        {
            success: false,
            message: "ເກີດຂໍ້ຜິດພາດພາຍໃນລະບົບ",
        },
        500
    );
});

app.route("/products", productRoutes);
app.route("/auth", authRoutes);

serve({
    fetch: app.fetch,
    port: 3000
});

console.log("🚀 Server ກຳລັງເຮັດວຽກຢູ່ http://localhost:3000");
